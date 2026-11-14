import { ClaudeSession } from "@src/apps/claude-code/models/ClaudeSession.ts"
import { ClaudeCodeAppState } from "@src/apps/claude-code/state/ClaudeCodeAppState.ts"
import { fn } from "storybook/test"

/** Relative to now, so the run time of sessions that are still working looks realistic. */
function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

export const workingSession: ClaudeSession = {
  id: "session-working",
  project: "personal-dashboard",
  cwd: "C:\\work\\personal-dashboard",
  prompt: "Add an app that shows what my Claude Code sessions are doing, updated live over the websocket.",
  status: "Working",
  waitingFor: null,
  currentActivity: "Run the backend integration tests",
  plan: [
    { content: "Look at how apps are set up", status: "Completed" },
    { content: "Build backend app", status: "Completed" },
    { content: "Add integration test and run it", status: "InProgress" },
    { content: "Build frontend widget", status: "Pending" },
    { content: "Verify end to end", status: "Pending" },
  ],
  promptStartedAt: minutesAgo(12.5),
  promptEndedAt: null,
  startedAt: "2026-11-14T17:02:00Z",
  updatedAt: "2026-11-14T18:41:00Z",
}

export const waitingSession: ClaudeSession = {
  id: "session-waiting",
  project: "winctrl",
  cwd: "C:\\work\\winctrl",
  prompt: "Clean up the build output",
  status: "WaitingForInput",
  waitingFor: "Permission: Delete the build directory",
  currentActivity: null,
  plan: [
    { content: "Find stale build output", status: "Completed" },
    { content: "Delete it", status: "InProgress" },
  ],
  promptStartedAt: minutesAgo(3),
  promptEndedAt: null,
  startedAt: "2026-11-14T18:30:00Z",
  updatedAt: "2026-11-14T18:39:00Z",
}

export const idleSession: ClaudeSession = {
  id: "session-idle",
  project: "dotfiles",
  cwd: "C:\\Users\\me\\dotfiles",
  prompt: "Why does my prompt show the wrong git branch?",
  status: "Idle",
  waitingFor: null,
  currentActivity: null,
  plan: [],
  promptStartedAt: "2026-11-14T15:10:00Z",
  promptEndedAt: "2026-11-14T15:14:23Z",
  startedAt: "2026-11-14T15:10:00Z",
  updatedAt: "2026-11-14T15:14:00Z",
}

export const claudeSessions = [workingSession, waitingSession, idleSession]

export function claudeCodeState(overrides: Partial<ClaudeCodeAppState> = {}): ClaudeCodeAppState {
  const sessions = overrides.sessions ?? claudeSessions

  return {
    sessions,
    waitingSessions: sessions.filter(it => it.status === "WaitingForInput"),
    error: null,
    discard: fn(),
    ...overrides,
  }
}
