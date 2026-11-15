import { zx } from "@src/infrastructure/framework/schemas/zx.ts"
import { z } from "zod"

export const CalendarEventSchema = z.object({
  id: z.string(),
  calendarName: z.string(),
  summary: z.string(),
  startTime: zx.dateTime(),
  endTime: zx.dateTime(),
})

export type CalendarEvent = z.infer<typeof CalendarEventSchema>

export type CalendarEventDTO = z.input<typeof CalendarEventSchema>
