


export function getStartOfDay(time: Date): Date {
  const startOfDay = new Date(time)
  startOfDay.setHours(0)
  startOfDay.setMinutes(0)
  startOfDay.setSeconds(0)
  startOfDay.setMilliseconds(0)
  return startOfDay
}

export function getStartOfMinute(time: Date): Date {
  const startOfMinute = new Date(time)
  startOfMinute.setSeconds(0)
  startOfMinute.setMilliseconds(0)
  return startOfMinute
}

export function getDecimalHours(time: Date | number): number {
  return time.valueOf() / (60 * 60 * 1_000)
}