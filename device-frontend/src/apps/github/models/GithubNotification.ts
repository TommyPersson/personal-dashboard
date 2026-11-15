import { zx } from "@src/infrastructure/framework/schemas/zx.ts"
import { z } from "zod"

export const GithubNotificationSchema = z.object({
  id: z.number(),
  unread: z.boolean(),
  lastReadAt: zx.dateTime().nullable(),
  reason: z.string(),
  title: z.string(),
  type: z.string(),
  url: z.string().nullable(),
  repositoryFullName: z.string(),
  updatedAt: zx.dateTime(),
})

export type GithubNotification = z.infer<typeof GithubNotificationSchema>

export type GithubNotificationDTO = z.input<typeof GithubNotificationSchema>
