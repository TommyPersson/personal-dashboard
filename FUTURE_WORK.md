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
* Alternatives: OpenTelemetry export (`CLAUDE_CODE_ENABLE_TELEMETRY`) for usage/cost, or reading transcripts in
  `~/.claude/projects/*/*.jsonl` (only on the PC, so it would need WinCtrl or a small forwarder).
