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
  prompt: string | null
  status: ClaudeSessionStatus
  waitingFor: string | null
  currentActivity: string | null
  plan: ClaudePlanItem[]
  promptStartedAt: string | null
  promptEndedAt: string | null
  startedAt: string
  updatedAt: string
}
