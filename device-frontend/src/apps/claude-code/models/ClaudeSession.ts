import { zx } from "@src/infrastructure/framework/schemas/zx.ts"
import { z } from "zod"

export const ClaudeSessionStatusSchema = z.enum(["Working", "WaitingForInput", "Idle"])

export type ClaudeSessionStatus = z.infer<typeof ClaudeSessionStatusSchema>

export const ClaudePlanItemStatusSchema = z.enum(["Pending", "InProgress", "Completed"])

export type ClaudePlanItemStatus = z.infer<typeof ClaudePlanItemStatusSchema>

export const ClaudePlanItemSchema = z.object({
  content: z.string(),
  status: ClaudePlanItemStatusSchema,
})

export type ClaudePlanItem = z.infer<typeof ClaudePlanItemSchema>

export const ClaudeWorktreeSchema = z.object({
  name: z.string(),
  path: z.string(),
  branch: z.string().nullable(),
})

export type ClaudeWorktree = z.infer<typeof ClaudeWorktreeSchema>

export const ClaudeSessionSchema = z.object({
  id: z.string(),
  project: z.string().nullable(),
  cwd: z.string().nullable(),
  worktree: ClaudeWorktreeSchema.nullable(),
  canOpenOnWorkstation: z.boolean(),
  prompt: z.string().nullable(),
  status: ClaudeSessionStatusSchema,
  waitingFor: z.string().nullable(),
  currentActivity: z.string().nullable(),
  plan: z.array(ClaudePlanItemSchema),
  promptStartedAt: zx.dateTime().nullable(),
  promptEndedAt: zx.dateTime().nullable(),
  result: z.string().nullable(),
  startedAt: zx.dateTime(),
  updatedAt: zx.dateTime(),
})

export type ClaudeSession = z.infer<typeof ClaudeSessionSchema>

/** A session as the backend sends it, with ISO 8601 strings for its timestamps. */
export type ClaudeSessionDTO = z.input<typeof ClaudeSessionSchema>
