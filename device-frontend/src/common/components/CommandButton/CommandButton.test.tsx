import * as stories from "./CommandButton.stories.tsx"
import { renderStory } from "@src/testing/renderStory.tsx"
import { composeStories } from "@storybook/react-vite"
import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

const { Default, Pending, Failing, CannotExecute, ArgsNotAvailable, Disabled } = composeStories(stories)

describe("CommandButton", () => {
  it("renders the command's label, and uses it as the accessible name when icon only", () => {
    renderStory(Default)

    const [labelled, iconOnly] = screen.getAllByRole("button", { name: "Run" })
    expect(labelled).toHaveTextContent("Run")
    expect(iconOnly).toHaveTextContent("")
  })

  it("is disabled while the command runs", async () => {
    renderStory(Pending)

    const [button] = screen.getAllByRole("button", { name: /Run forever/ })
    fireEvent.click(button)

    await waitFor(() => expect(button).toBeDisabled())
  })

  it("shows the error when the command fails", async () => {
    renderStory(Failing)

    const [button] = screen.getAllByRole("button", { name: "Fail" })
    fireEvent.click(button)

    const alert = await screen.findByRole("alert")
    expect(within(alert).getByText("Unable to run")).toBeInTheDocument()
    expect(alert).toHaveTextContent("UNAVAILABLE: WinCtrl is down")

    fireEvent.click(within(alert).getByRole("button", { name: "Close" }))
    // The popover fades out
    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument())
  })

  it("is disabled when the command can't execute with the given args", () => {
    renderStory(CannotExecute)

    for (const button of screen.getAllByRole("button", { name: "Delete item" })) {
      expect(button).toBeDisabled()
    }
  })

  it("is disabled while the args aren't available", () => {
    renderStory(ArgsNotAvailable)

    for (const button of screen.getAllByRole("button", { name: "Delete item" })) {
      expect(button).toBeDisabled()
    }
  })

  it("can be disabled", () => {
    renderStory(Disabled)

    for (const button of screen.getAllByRole("button", { name: "Run" })) {
      expect(button).toBeDisabled()
    }
  })
})
