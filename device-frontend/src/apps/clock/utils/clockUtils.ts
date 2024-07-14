import { DateTime } from "luxon"

export function formatDay(date: DateTime): string {
  return date.toFormat("EEEE")
}

export function formatDate(date: DateTime): string {
  return date.toFormat("MM-dd")
}

export function formatTime(date: DateTime): string {
  return date.toFormat("HH:mm")
}

export function formatWeek(date: DateTime): string {
  return date.weekNumber.toString()
}