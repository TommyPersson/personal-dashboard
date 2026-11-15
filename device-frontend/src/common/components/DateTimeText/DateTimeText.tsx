import { DateTime } from "luxon"
import React from "react"

export type DateTimeTextFormat = "time" | "date" | "dateTime"

export type DateTimeTextProps = {
  /** A DateTime, or an ISO 8601 string such as the timestamps in API payloads. */
  value: DateTime | string
  format?: DateTimeTextFormat
}

/** Renders a point in time, in the device's time zone, in one of the dashboard's standard formats. */
export const DateTimeText = React.memo((props: DateTimeTextProps) => {
  const { value, format = "dateTime" } = props

  const dateTime = typeof value === "string" ? DateTime.fromISO(value) : value
  if (!dateTime.isValid) {
    return null
  }

  return <time dateTime={dateTime.toISO() ?? undefined}>{dateTime.toFormat(formats[format])}</time>
})

const formats: Record<DateTimeTextFormat, string> = {
  time: "HH:mm",
  date: "yyyy-MM-dd",
  dateTime: "yyyy-MM-dd HH:mm",
}
