import { calendarState } from "@src/apps/calendar/stories/calendarFixtures.ts"
import { CalendarAppWidget } from "@src/apps/calendar/ui/CalendarAppWidget.tsx"
import { CalendarLockScreenWidget } from "@src/apps/calendar/ui/CalendarLockScreenWidget.tsx"
import { OperationError } from "@src/infrastructure/framework/errors"
import { withAppSlot, withLockScreen } from "@src/storybook/frames.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Apps/Calendar",
  component: CalendarAppWidget,
  args: { state: calendarState() },
} satisfies Meta<typeof CalendarAppWidget>

export default meta

type Story = StoryObj<typeof meta>

export const AppWidget: Story = {
  decorators: [withAppSlot],
}

export const AppWidgetEmpty: Story = {
  args: { state: calendarState({ events: [] }) },
  decorators: [withAppSlot],
}

export const AppWidgetNotAuthenticated: Story = {
  args: {
    state: calendarState({
      events: [],
      error: new OperationError({ requestId: "1", errorCode: "NOT_AUTHENTICATED", errorMessage: "Not authenticated" }),
    }),
  },
  decorators: [withAppSlot],
}

export const LockScreenWidget: Story = {
  render: (args) => <CalendarLockScreenWidget {...args} />,
  decorators: [withLockScreen],
}

export const LockScreenWidgetEmpty: Story = {
  args: { state: calendarState({ events: [] }) },
  render: (args) => <CalendarLockScreenWidget {...args} />,
  decorators: [withLockScreen],
}
