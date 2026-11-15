import { zx } from "@src/infrastructure/framework/schemas/zx.ts"
import { describe, expect, it } from "vitest"

describe("zx.dateTime", () => {
  it("parses a UTC timestamp with nanoseconds into the device's time zone", () => {
    const value = zx.dateTime().parse("2026-11-15T15:09:34.341878100Z")

    expect(value.toISO()).toBe("2026-11-15T16:09:34.341+01:00")
  })

  it("rejects strings that aren't ISO 8601", () => {
    expect(zx.dateTime().safeParse("yesterday").success).toBe(false)
  })
})

describe("zx.duration", () => {
  it("parses an ISO 8601 duration", () => {
    expect(zx.duration().parse("PT1H5M").as("minutes")).toBe(65)
  })

  it("rejects strings that aren't ISO 8601", () => {
    expect(zx.duration().safeParse("5 minutes").success).toBe(false)
  })
})
