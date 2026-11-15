import { zx } from "@src/infrastructure/framework/schemas/zx.ts"
import { z } from "zod"

export const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  /** Base64-encoded image. */
  thumbnail: z.string().nullable(),
  source: z.string(),
  timestamp: zx.dateTime(),
})

export type Notification = z.infer<typeof NotificationSchema>

export type NotificationDTO = z.input<typeof NotificationSchema>
