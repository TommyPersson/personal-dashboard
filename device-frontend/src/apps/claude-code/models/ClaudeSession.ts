export type ClaudeSessionStatus = "Working" | "WaitingForInput" | "Idle"

export type ClaudePlanItemStatus = "Pending" | "InProgress" | "Completed"

export type ClaudePlanItem = {
  content: string
  status: ClaudePlanItemStatus
}

export type ClaudeSession = {
  id: string
  project: string | null
  cwd: string | null
  /** Whether the session can be opened in the Claude desktop app on the workstation. */
  canOpenOnWorkstation: boolean
  prompt: string | null
  status: ClaudeSessionStatus
  waitingFor: string | null
  currentActivity: string | null
  plan: ClaudePlanItem[]
  promptStartedAt: string | null
  promptEndedAt: string | null
  /** A shortened, plain-text version of Claude's last message on the latest prompt. */
  result: string | null
  startedAt: string
  updatedAt: string
}
