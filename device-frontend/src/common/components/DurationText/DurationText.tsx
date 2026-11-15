import { Duration } from "luxon"
import React from "react"

/**
 * * `compact`: the two largest units, e.g. `1h 5m`, `4m 07s` or `12s`.
 * * `clock`: a countdown style, e.g. `04:07`, or `1:05:00` from an hour and up.
 */
export type DurationTextFormat = "compact" | "clock"

export type DurationTextProps = {
  /** Negative durations are shown as zero. */
  value: Duration
  format?: DurationTextFormat
}

/** Renders a length of time in one of the dashboard's standard formats. */
export const DurationText = React.memo((props: DurationTextProps) => {
  const { value, format = "compact" } = props

  if (!value.isValid) {
    return null
  }

  const duration = value.toMillis() < 0 ? Duration.fromMillis(0) : value

  return <time dateTime={duration.toISO() ?? undefined}>{formatDuration(duration, format)}</time>
})

function formatDuration(duration: Duration, format: DurationTextFormat): string {
  const hasHours = duration.as("hours") >= 1

  switch (format) {
    case "compact":
      if (hasHours) {
        return duration.toFormat("h'h' m'm'")
      }
      if (duration.as("minutes") >= 1) {
        return duration.toFormat("m'm' ss's'")
      }
      return duration.toFormat("s's'")
    case "clock":
      return duration.toFormat(hasHours ? "h:mm:ss" : "mm:ss")
  }
}
