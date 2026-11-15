import * as stories from "@src/apps/notifications/stories/Notifications.stories.tsx"
import { NotificationsApiStub, stubNotificationsApi } from "@src/apps/notifications/testing/NotificationsApiStub.ts"
import { apiError } from "@src/testing/apiError.ts"
import { server } from "@src/testing/msw.ts"
import { renderStory } from "@src/testing/renderStory.tsx"
import { composeStories } from "@storybook/react-vite"
import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { http } from "msw"
import { beforeEach, describe, expect, it } from "vitest"

const { AppWidgetMinimized } = composeStories(stories)

describe("NotificationsAppWidget", () => {
  let api: NotificationsApiStub

  beforeEach(() => {
    api = stubNotificationsApi()
  })

  async function renderExpanded() {
    renderStory(AppWidgetMinimized)
    // The badge's button expands the widget
    fireEvent.click(within((await screen.findByText("3")).parentElement!).getByRole("button"))
    await screen.findByText("Build failed")
  }

  it("lists the notifications", async () => {
    await renderExpanded()

    expect(screen.getByText("New message from Alex")).toBeInTheDocument()
    expect(screen.getByText("Disk space low")).toBeInTheDocument()
  })

  it("dismisses a notification", async () => {
    await renderExpanded()

    fireEvent.click(screen.getAllByRole("button", { name: "Dismiss" })[0])

    await waitFor(() => expect(screen.queryByText("Build failed")).not.toBeInTheDocument())
    expect(api.dismissedIds).toEqual(["n1"])
    expect(screen.getByText("New message from Alex")).toBeInTheDocument()
  })

  it("clears all notifications", async () => {
    await renderExpanded()

    fireEvent.click(screen.getByRole("button", { name: "Clear" }))

    await waitFor(() => expect(api.notifications).toEqual([]))
    expect(api.dismissedIds).toEqual(expect.arrayContaining(["n1", "n2", "n3"]))
    await waitFor(() => expect(screen.queryByText("Build failed")).not.toBeInTheDocument())
  })

  it("shows why a notification couldn't be dismissed", async () => {
    server.use(
      http.post("/api/notifications/:id/actions/dismiss", () => apiError(503, "UNAVAILABLE", "Backend is restarting")),
    )
    await renderExpanded()

    fireEvent.click(screen.getAllByRole("button", { name: "Dismiss" })[0])

    const alert = await screen.findByRole("alert")
    expect(within(alert).getByText("Unable to dismiss the notification")).toBeInTheDocument()
    expect(alert).toHaveTextContent("Backend is restarting")
    expect(api.notifications).toHaveLength(3)
  })
})
