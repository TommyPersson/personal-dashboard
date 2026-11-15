// Claude Code hook: forwards the hook's stdin payload to the dashboard backend's Claude Code app.
//
// Normally run by the `personal-dashboard` plugin in this folder, which passes its "Dashboard backend URLs" option
// as CLAUDE_PLUGIN_OPTION_BACKEND_URL. Can also be registered by hand in a settings file:
//
//   node forward-event.mjs [backend-urls]     e.g. node forward-event.mjs http://dashboard.lan:8080,http://localhost:8081
//
// The URLs are taken from the argument, then CLAUDE_PLUGIN_OPTION_BACKEND_URL, then default to http://localhost:8080.
// Several URLs are separated by commas (or whitespace); the event is posted to all of them in parallel.
// Set CLAUDE_EVENTS_FILE to also append every (trimmed) payload to that JSONL file, for debugging.
// Never fails the hook: errors are written to stderr and the script exits 0.

import { execFileSync } from "node:child_process"
import { appendFileSync, mkdirSync } from "node:fs"
import { basename, dirname, relative, resolve, isAbsolute } from "node:path"

const backendUrls = (process.argv[2] || process.env.CLAUDE_PLUGIN_OPTION_BACKEND_URL || "http://localhost:8080")
  .split(/[\s,]+/)
  .filter(Boolean)
  .map((url) => url.replace(/\/+$/, ""))
const eventsFile = process.env.CLAUDE_EVENTS_FILE

const TIMEOUT_MS = 2000
const GIT_TIMEOUT_MS = 1000
// Asking git costs a process per event, so only events that start, prompt or end a turn carry the worktree.
const WORKTREE_EVENTS = new Set(["SessionStart", "UserPromptSubmit", "Stop", "StopFailure"])
// The backend only needs short fields (descriptions, paths, task lists); file contents and command output stay here.
const MAX_STRING_LENGTH = 2000

let input = ""
process.stdin.setEncoding("utf8")
process.stdin.on("data", (chunk) => (input += chunk))
process.stdin.on("end", async () => {
  try {
    const event = JSON.parse(input)
    // `cwd` follows the shell's working directory; the project directory is the session's folder.
    event.project_dir = process.env.CLAUDE_PROJECT_DIR
    // The Claude desktop app's own ID for the session (`local_…`), which its `claude://` links take. Only set for
    // sessions run by the desktop app.
    event.host_session_id = process.env.CLAUDE_CODE_HOST_SESSION_ID
    if (WORKTREE_EVENTS.has(event.hook_event_name)) {
      event.git_worktree = findWorktree(worktreeLookupDir(event))
    }
    delete event.tool_response
    if (event.tool_input) {
      event.tool_input = truncateStrings(event.tool_input)
    }
    for (const field of ["prompt", "last_assistant_message"]) {
      if (typeof event[field] === "string") {
        event[field] = truncate(event[field])
      }
    }

    if (eventsFile) {
      mkdirSync(dirname(eventsFile), { recursive: true })
      appendFileSync(eventsFile, JSON.stringify({ ts: new Date().toISOString(), ...event }) + "\n")
    }

    const body = JSON.stringify(event)
    await Promise.all(backendUrls.map((url) => post(url, body)))
  } catch (e) {
    process.stderr.write(`forward-event: ${e.message}\n`)
  }
  process.exit(0)
})

// One backend being down or slow doesn't keep the event from the others.
async function post(backendUrl, body) {
  try {
    const response = await fetch(`${backendUrl}/api/apps/claude/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) {
      process.stderr.write(`forward-event: ${backendUrl} responded ${response.status}\n`)
    }
  } catch (e) {
    process.stderr.write(`forward-event: ${backendUrl}: ${e.message}\n`)
  }
}

// The session's folder, or the shell's working directory while it is inside it (e.g. after the CLI's EnterWorktree,
// which puts the worktree under the project's `.claude/worktrees`), but not when the shell has wandered elsewhere.
function worktreeLookupDir(event) {
  const projectDir = event.project_dir
  const cwd = event.cwd
  if (!projectDir) return cwd
  if (!cwd) return projectDir
  const rel = relative(resolve(projectDir), resolve(cwd))
  return rel && !rel.startsWith("..") && !isAbsolute(rel) ? cwd : projectDir
}

// The linked git worktree `dir` is in: its root, branch (null when detached) and the main repository's folder.
// Null for the main checkout, or outside a repository, so the backend can tell "not a worktree" from "not asked".
function findWorktree(dir) {
  if (!dir) return null
  try {
    const output = execFileSync(
      "git",
      ["-C", dir, "rev-parse", "--path-format=absolute", "--git-dir", "--git-common-dir", "--show-toplevel", "--abbrev-ref", "HEAD"],
      { encoding: "utf8", timeout: GIT_TIMEOUT_MS, stdio: ["ignore", "pipe", "ignore"], windowsHide: true },
    )
    const [gitDir, commonDir, topLevel, branch] = output.trim().split(/\r?\n/)
    if (!gitDir || !commonDir || resolve(gitDir) === resolve(commonDir)) return null
    return {
      path: topLevel,
      branch: branch && branch !== "HEAD" ? branch : null,
      // The common dir is the main checkout's `.git`, unless the repository is bare.
      repository_dir: basename(commonDir) === ".git" ? dirname(commonDir) : null,
    }
  } catch {
    return null
  }
}

function truncate(value) {
  return value.length > MAX_STRING_LENGTH ? value.slice(0, MAX_STRING_LENGTH) + "…" : value
}

function truncateStrings(value) {
  if (typeof value === "string") return truncate(value)
  if (Array.isArray(value)) return value.map(truncateStrings)
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, truncateStrings(v)]))
  }
  return value
}
