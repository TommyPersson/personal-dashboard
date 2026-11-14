# WinCtrl <-> Backend security

Both the docker container and the workstation companion run on internal networks without any https/certificate 
infrastructure. But I still want to prevent command injection from compromised network devices. One possible method
is to introduce explicit signing of each request sent from the backend to the workstation. 

Perhaps using JWTs with asymmetric keys.
The JWT would be unique for each request and include a nonce and a hash of the request body.
Information-hiding and encryption is a non-goal.


# Calendar integration tests

Google Calendar sync is disabled (`AggregateCalendarState.refresh`) until sign-in moves from the tray icon to the
frontend, so `CalendarIT` only covers the empty endpoint. Once sync is back, the Google API root URL could be made
configurable (`Calendar.Builder.setRootUrl`) and pointed at a WireMock server, with a stored test credential in
`DATA_DIR/data/google/...`.


# Claude Code app

The first version is in (`apps/claude` on the backend, `apps/claude-code` on the frontend, fed by
`tools/claude-hooks/forward-event.mjs`). Follow-ups:

* Ingest token: `POST /api/apps/claude/events` is unauthenticated, like `POST /api/notifications`. A token in an app
  config needs configs to be optional first, since a missing config file fails startup.
* The desktop app's task list comes from `mcp__ccd_turn__update_plan`, an internal tool whose shape may change. The
  CLI's newer `TaskCreate`/`TaskUpdate` tools aren't folded into the plan yet, only `TodoWrite`.
* The frontend refetches all sessions on every websocket message (several per second while Claude works); it could
  apply the session in `ClaudeSessionUpdated` directly.
* Sessions that end without a `SessionEnd` event (e.g. the desktop app keeps them open) stay until discarded; idle
  sessions could expire after a while.
* Session names: cards are named after the project directory, which several sessions can share. Hook payloads have no
  title, but they carry `transcript_path`, and the transcript JSONL has `{"type":"custom-title","customTitle":...}`
  lines (the desktop app's session title, or a CLI `/rename`). `forward-event.mjs` could read the transcript's tail
  for the latest one and send it as `session_title`, which the backend keeps when an event has none. Fall back to the
  git branch (`gitBranch` on transcript lines, distinct per worktree), then the session's first prompt, then a short
  session id. The transcript format is internal and may change, so the lookup must fail quietly.
* Alternatives: OpenTelemetry export (`CLAUDE_CODE_ENABLE_TELEMETRY`) for usage/cost, or reading transcripts in
  `~/.claude/projects/*/*.jsonl` (only on the PC, so it would need WinCtrl or a small forwarder).
* More to show from hook payloads (fields the backend ignores today):
  * Badges for `permission_mode` (plan, auto, bypassPermissions) and `effort.level`, plus the model from
    `SessionStart.model` and `PostModelSwitch.to_model` (not always sent).
  * Subagents: events from a subagent carry `agent_id`/`agent_type`; registering `SubagentStart`/`SubagentStop` would
    let a card show running subagents (e.g. "2 × Explore") instead of mixing their tool calls into the main activity.
  * Failures: `StopFailure`'s error type (`rate_limit`, `overloaded`, `billing_error`, ...) as a distinct red state
    rather than plain Idle; a count of `PostToolUseFailure` per turn.
  * Turn result: `Stop.last_assistant_message` (truncated) as the card's text once Claude is done.
  * Turn stats: pairing `PreToolUse`/`PostToolUse` by `tool_use_id` gives tool durations; also tool counts and the
    files edited (`Edit`/`Write` `file_path`) in the turn.
  * Context fill: hooks carry no token usage, but `forward-event.mjs` runs on the PC and could read the latest
    `usage` from the transcript tail (same caveats as session names). `PreCompact`/`PostCompact` mark compactions.
  * Worktrees: `cwd` differing from `project_dir` shows a session working in a worktree or subfolder.
  * `SessionStart.source` (resume, fork, compact) and the `SessionEnd` reason for a short history line.


# Sync lock state with the PC

Polling heuristics (LogonUI.exe running, `OpenInputDesktop` failing, foreground window checks) are unreliable across
Windows versions and lock methods. Listen for transitions instead; they fire for every way of locking (Win+L,
Ctrl+Alt+Del, idle timeout/screen saver, Dynamic Lock, RDP disconnect, lock before sleep):

* No WinCtrl changes: two Task Scheduler tasks with "On workstation lock" / "On workstation unlock" triggers that run a
  small forwarder (like `tools/claude-hooks/forward-event.mjs`) POSTing to e.g. `/api/core/host-lock`. No audit policy
  needed (unlike Security events 4800/4801).
* In WinCtrl: `WTSRegisterSessionNotification` -> `WM_WTSSESSION_CHANGE` (`WTS_SESSION_LOCK`/`UNLOCK`), or
  `SystemEvents.SessionSwitch` in .NET (needs a message loop). As a service: `SERVICE_CONTROL_SESSIONCHANGE`.
* Seed the state at startup with `WTSQuerySessionInformation(WTSSessionInfoEx)` -> `SessionFlags`; note the flags
  are inverted on Windows 7 / Server 2008 R2, fine on 10/11.
* Events get lost when the PC sleeps or the network drops, so treat a stale/unreachable host as "locked" and have the
  forwarder (or WinCtrl) also re-send the current state periodically.
* Sleep/hibernate/shutdown should lock too. A notification at suspend is only best effort (the network may be gone
  before it's sent), so the reliable part is the backend probing WinCtrl: poll an existing endpoint (e.g.
  `GET /api/system-media/status`) every few seconds with a short timeout, and lock after a few consecutive failures.
  That also covers shutdown, crashes and network loss; locking is the safe default for all of them. Faster, best-effort
  signals on top:
  * Task Scheduler "On an event" trigger: System log, source `Kernel-Power`, event ID 42 (entering sleep). Resume is
    `Power-Troubleshooter` ID 1, but resume shouldn't unlock; the unlock event follows sign-in.
  * In WinCtrl: `WM_POWERBROADCAST`/`PBT_APMSUSPEND` (`SystemEvents.PowerModeChanged` in .NET), which leaves ~2 s to
    send. On Modern Standby PCs it can come minutes after the screen turns off, so also watch display-off via
    `RegisterPowerSettingNotification(GUID_CONSOLE_DISPLAY_STATE)`.
  * With "require sign-in on wake" (the default), Windows locks the session as it suspends, so the lock trigger above
    often fires already.
* Probably only PC lock -> dashboard lock by default. PC unlock -> dashboard unlock lets any LAN device that can hit the
  endpoint unlock the dashboard, so it needs the request signing above first. The reverse (dashboard lock -> PC lock)
  is just `LockWorkStation()`.


# Host-initiated connection to the backend

To avoid opening inbound firewall ports on the PC, the host (WinCtrl or a forwarder) dials out to the backend over a
WebSocket instead of the backend calling `core.winCtrl.url`.

* It's RPC, not a fire-and-forget queue: `WinCtrlFacade` also reads (media status, thumbnail, icons, active window).
  Frame messages as `{id, method, params}` / `{id, result | error}`, correlate by id with a timeout, and keep the
  facade interface so only the binding in `CoreGuiceModule` changes. Binary results as base64, or the host POSTs them.
* Don't queue commands while the host is offline: a skip-next replayed minutes later is wrong. Fail fast instead.
* Hot reads (media status, active window) could become host-pushed state with change events, avoiding round trips.
* Security improves: the PC listens on nothing, so request signing (above) is replaced by the host authenticating to
  the backend (shared token or keypair) when it connects. Backend-side TLS matters more since the token crosses the LAN.
* The connection doubles as presence for lock sync (above): disconnect / missed heartbeats -> lock.
* WinCtrl changes are out of scope, so a first step is a small relay on the PC that holds the WebSocket and forwards
  each call to WinCtrl on localhost. Integration tests would play the host with a WebSocket client instead of WireMock.
* Alternative without code changes: an overlay network (Tailscale/WireGuard) between server and PC.
