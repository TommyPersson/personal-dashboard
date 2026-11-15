import { replaceEqualDeepWithLuxon } from "@src/infrastructure/framework/query/structuralSharing.ts"
import { DateTime, Duration } from "luxon"
import { describe, expect, it } from "vitest"

const parse = (json: string) => JSON.parse(json, (_key, value) => {
  if (typeof value === "string" && value.startsWith("PT")) {
    return Duration.fromISO(value)
  }
  if (typeof value === "string" && /^\d{4}-/.test(value)) {
    return DateTime.fromISO(value)
  }
  return value
})

const response = JSON.stringify({
  items: [
    { id: "a", timestamp: "2026-11-13T08:55:00Z", duration: "PT1H" },
    { id: "b", timestamp: "2026-11-13T08:31:00Z", duration: "PT5M" },
  ],
})

describe("replaceEqualDeepWithLuxon", () => {
  it("keeps the old data when a refetch returns equal data", () => {
    const prev = parse(response)

    expect(replaceEqualDeepWithLuxon(prev, parse(response))).toBe(prev)
  })

  it("keeps the unchanged parts when something changed", () => {
    const prev = parse(response)
    const next = parse(response.replace("PT5M", "PT6M"))

    const result = replaceEqualDeepWithLuxon(prev, next)

    expect(result).not.toBe(prev)
    expect(result.items[0]).toBe(prev.items[0])
    expect(result.items[1]).not.toBe(prev.items[1])
    expect(result.items[1].timestamp).toBe(prev.items[1].timestamp)
    expect(result.items[1].duration.toISO()).toBe("PT6M")
  })

  it("replaces a DateTime in another zone, as it formats differently", () => {
    const prev = DateTime.fromISO("2026-11-13T08:55:00Z")
    const next = prev.setZone("America/New_York")

    expect(replaceEqualDeepWithLuxon(prev, next)).toBe(next)
  })

  it("notices removed and added items", () => {
    const prev = parse(response)

    expect(replaceEqualDeepWithLuxon(prev, { items: prev.items.slice(1) })).not.toBe(prev)
    expect(replaceEqualDeepWithLuxon(prev, { items: [...prev.items, { id: "c" }] })).not.toBe(prev)
    expect(replaceEqualDeepWithLuxon(prev, { ...prev, extra: true })).not.toBe(prev)
  })
})
