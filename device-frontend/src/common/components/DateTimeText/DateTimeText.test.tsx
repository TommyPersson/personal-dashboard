import * as stories from "./DateTimeText.stories.tsx"
import { renderStory } from "@src/testing/renderStory.tsx"
import { composeStories } from "@storybook/react-vite"
import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

const { DateAndTime, DateOnly, Time, IsoString, Invalid } = composeStories(stories)

describe("DateTimeText", () => {
  it("renders date and time by default, in the device's time zone", () => {
    renderStory(DateAndTime)

    const element = screen.getByText("2026-11-14 19:41")
    expect(element.tagName).toBe("TIME")
    expect(element).toHaveAttribute("datetime", "2026-11-14T19:41:00.000+01:00")
  })

  it("renders only the date", () => {
    renderStory(DateOnly)

    expect(screen.getByText("2026-11-14")).toBeInTheDocument()
  })

  it("renders only the time", () => {
    renderStory(Time)

    expect(screen.getByText("19:41")).toBeInTheDocument()
  })

  it("accepts an ISO 8601 string", () => {
    renderStory(IsoString)

    expect(screen.getByText("19:41")).toHaveAttribute("datetime", "2026-11-14T19:41:00.000+01:00")
  })

  it("renders nothing for an invalid value", () => {
    const { container } = renderStory(Invalid)

    expect(container.querySelector("time")).toBeNull()
    expect(container).toHaveTextContent(/^$/)
  })
})
