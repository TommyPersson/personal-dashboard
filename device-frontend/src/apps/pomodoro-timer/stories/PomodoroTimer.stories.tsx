import { PomodoroDurationSeconds, usePomodoroTimerAppState } from "@src/apps/pomodoro-timer/state/PomodoroTimerAppState.ts"
import { pomodoroState } from "@src/apps/pomodoro-timer/stories/pomodoroFixtures.ts"
import { PomodoroTimerAppBarIcon } from "@src/apps/pomodoro-timer/ui/PomodoroTimerAppBarIcon.tsx"
import { PomodoroTimerAppWidget } from "@src/apps/pomodoro-timer/ui/PomodoroTimerAppWidget.tsx"
import { PomodoroTimerLockScreenWidget } from "@src/apps/pomodoro-timer/ui/PomodoroTimerLockScreenWidget.tsx"
import { withAppBar, withAppSlot, withLockScreen } from "@src/storybook/frames.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Apps/Pomodoro Timer",
  component: PomodoroTimerAppWidget,
  args: { state: pomodoroState(PomodoroDurationSeconds, false) },
} satisfies Meta<typeof PomodoroTimerAppWidget>

export default meta

type Story = StoryObj<typeof meta>

export const AppWidgetIdle: Story = {
  decorators: [withAppSlot],
}

export const AppWidgetRunning: Story = {
  args: { state: pomodoroState(12 * 60 + 34, true) },
  decorators: [withAppSlot],
}

export const AppWidgetAlmostFinished: Story = {
  args: { state: pomodoroState(20, true) },
  decorators: [withAppSlot],
}

export const AppWidgetFinished: Story = {
  args: { state: pomodoroState(0, false) },
  decorators: [withAppSlot],
}

const LiveAppWidget = () => <PomodoroTimerAppWidget state={usePomodoroTimerAppState()} />

/** Uses the real timer state, so the buttons work. */
export const AppWidgetInteractive: Story = {
  render: () => <LiveAppWidget />,
  decorators: [withAppSlot],
}

export const LockScreenWidget: Story = {
  args: { state: pomodoroState(12 * 60 + 34, true) },
  render: (args) => <PomodoroTimerLockScreenWidget {...args} />,
  decorators: [withLockScreen],
}

export const AppBarIconIdle: Story = {
  render: (args) => <PomodoroTimerAppBarIcon {...args} />,
  decorators: [withAppBar],
}

export const AppBarIconRunning: Story = {
  args: { state: pomodoroState(12 * 60 + 34, true) },
  render: (args) => <PomodoroTimerAppBarIcon {...args} />,
  decorators: [withAppBar],
}
