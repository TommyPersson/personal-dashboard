import { DateTime } from "luxon"


export function getStartOfMinute(time: DateTime): DateTime {
  return time.startOf("minute")
}

export function getDecimalHours(time: DateTime | number): number {
  return time.valueOf() / (60 * 60 * 1_000)
}