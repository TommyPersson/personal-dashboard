import { NewNotificationMessage } from "@src/apps/notifications/messages"
import { notificationDTOs, notifications, notificationsHandlers } from "@src/apps/notifications/stories/notificationsFixtures.ts"
import { NotificationsAppWidget } from "@src/apps/notifications/ui/NotificationsAppWidget.tsx"
import { NotificationsToastOverlay } from "@src/apps/notifications/ui/NotificationsToastOverlay.tsx"
import { withAppArea, withAppSlot } from "@src/storybook/frames.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { http, HttpResponse } from "msw"
import { useEffect } from "react"

/** The notifications widget loads its own data; it is served here by MSW. */
const meta = {
  title: "Apps/Notifications",
  component: NotificationsAppWidget,
} satisfies Meta<typeof NotificationsAppWidget>

export default meta

type Story = StoryObj<typeof meta>

/** The widget starts minimized, so it is expanded by clicking the notifications icon. */
export const AppWidget: Story = {
  decorators: [withAppSlot],
  parameters: { msw: { handlers: { notifications: notificationsHandlers } } },
  play: async ({ canvas, userEvent }) => {
    await canvas.findByText(String(notifications.length))
    await userEvent.click(canvas.getAllByRole("button")[0])
  },
}

export const AppWidgetMinimized: Story = {
  decorators: [withAppSlot],
  parameters: { msw: { handlers: { notifications: notificationsHandlers } } },
}

/** Without notifications the widget collapses to an icon; expand it to see the empty state. */
export const AppWidgetEmpty: Story = {
  decorators: [withAppSlot],
  parameters: {
    msw: {
      handlers: {
        notifications: http.get("/api/notifications", () => HttpResponse.json({ items: [] })),
      },
    },
  },
}

/** Toasts are driven by websocket messages, which are simulated here with `window.postMessage`. */
const ToastOverlayWithMessages = () => {
  useEffect(() => {
    const handles = notificationDTOs.map((notification, i) => setTimeout(() => {
      window.postMessage({ type: NewNotificationMessage.type, notification }, "*")
    }, 300 + i * 400))
    return () => handles.forEach(clearTimeout)
  }, [])

  return <NotificationsToastOverlay />
}

export const ToastOverlay: Story = {
  render: () => <ToastOverlayWithMessages />,
  decorators: [withAppArea],
}
