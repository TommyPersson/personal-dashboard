// Claude Code hook: forwards the hook's stdin payload to the dashboard backend's Claude Code app.
//
// Normally run by the `personal-dashboard` plugin in this folder, which passes its "Dashboard backend URL" option
// as CLAUDE_PLUGIN_OPTION_BACKEND_URL. Can also be registered by hand in a settings file:
//
//   node forward-event.mjs [backend-url]      e.g. node forward-event.mjs http://dashboard.lan:8080
//
// The URL is taken from the argument, then CLAUDE_PLUGIN_OPTION_BACKEND_URL, then defaults to http://localhost:8080.
// Set CLAUDE_EVENTS_FILE to also append every (trimmed) payload to that JSONL file, for debugging.
// Never fails the hook: errors are written to stderr and the script exits 0.

import { appendFileSync, mkdirSync } from "node:fs"
import { dirname } from "node:path"

const backendUrl = (process.argv[2] || process.env.CLAUDE_PLUGIN_OPTION_BACKEND_URL || "http://localhost:8080")
  .replace(/\/+$/, "")
const eventsFile = process.env.CLAUDE_EVENTS_FILE

const TIMEOUT_MS = 2000
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
    delete event.tool_response
    if (event.tool_input) {
      event.tool_input = truncateStrings(event.tool_input)
    }
    if (typeof event.prompt === "string") {
      event.prompt = truncate(event.prompt)
    }

    if (eventsFile) {
      mkdirSync(dirname(eventsFile), { recursive: true })
      appendFileSync(eventsFile, JSON.stringify({ ts: new Date().toISOString(), ...event }) + "\n")
    }

    const response = await fetch(`${backendUrl}/api/apps/claude/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) {
      process.stderr.write(`forward-event: backend responded ${response.status}\n`)
    }
  } catch (e) {
    process.stderr.write(`forward-event: ${e.message}\n`)
  }
  process.exit(0)
})

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
