import * as stories from "./DurationText.stories.tsx"
import { renderStory } from "@src/testing/renderStory.tsx"
import { composeStories } from "@storybook/react-vite"
import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

const { CompactSeconds, CompactMinutes, CompactHours, ClockMinutes, ClockHours, Negative } = composeStories(stories)

describe("DurationText", () => {
  it("renders whole seconds below a minute", () => {
    renderStory(CompactSeconds)

    const element = screen.getByText("12s")
    expect(element.tagName).toBe("TIME")
    expect(element).toHaveAttribute("datetime", "PT12.6S")
  })

  it("renders minutes and padded seconds below an hour", () => {
    renderStory(CompactMinutes)

    expect(screen.getByText("4m 07s")).toHaveAttribute("datetime", "PT4M7S")
  })

  it("renders hours and minutes from an hour and up", () => {
    renderStory(CompactHours)

    expect(screen.getByText("1h 5m")).toBeInTheDocument()
  })

  it("renders a clock below an hour", () => {
    renderStory(ClockMinutes)

    expect(screen.getByText("04:07")).toBeInTheDocument()
  })

  it("renders a clock with hours from an hour and up", () => {
    renderStory(ClockHours)

    expect(screen.getByText("1:05:00")).toBeInTheDocument()
  })

  it("renders a negative duration as zero", () => {
    renderStory(Negative)

    expect(screen.getByText("0s")).toHaveAttribute("datetime", "PT0S")
  })
})
