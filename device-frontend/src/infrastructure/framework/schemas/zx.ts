import { DateTime, Duration } from "luxon"
import { z } from "zod"

/** The dashboard's own Zod schemas, kept apart from `z`. */
export const zx = {
  /** An ISO 8601 timestamp, e.g. `2026-11-15T15:09:34.341878100Z`, parsed into a DateTime in the device's time zone. */
  dateTime: () => z.string().transform((value, ctx) => {
    const dateTime = DateTime.fromISO(value)
    if (!dateTime.isValid) {
      ctx.addIssue({ code: "custom", message: `Invalid ISO 8601 date-time: ${dateTime.invalidExplanation}` })
      return z.NEVER
    }
    return dateTime
  }),

  /** An ISO 8601 duration, e.g. `PT1H5M`, parsed into a Duration. */
  duration: () => z.string().transform((value, ctx) => {
    const duration = Duration.fromISO(value)
    if (!duration.isValid) {
      ctx.addIssue({ code: "custom", message: `Invalid ISO 8601 duration: ${duration.invalidExplanation}` })
      return z.NEVER
    }
    return duration
  }),
}
