
export function formatDay(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long" })
}

export function formatDate(date: Date): string {
  const day = date.toLocaleDateString("sv-SE", { day: "2-digit" })
  const month = date.toLocaleDateString("sv-SE", { month: "2-digit" })
  return `${month}-${day}`
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })
}

export function formatWeek(date: Date): string {
  // https://www.epochconverter.com/weeknumbers
  const target  = new Date(date.valueOf());
  const dayNr   = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() != 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
  return weekNumber.toString();
}