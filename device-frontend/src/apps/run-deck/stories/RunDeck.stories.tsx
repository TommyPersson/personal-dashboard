import { runDeckState } from "@src/apps/run-deck/stories/runDeckFixtures.ts"
import { RunDeckAppBarIcon } from "@src/apps/run-deck/ui/RunDeckAppBarIcon.tsx"
import { RunDeckAppWidget } from "@src/apps/run-deck/ui/RunDeckAppWidget.tsx"
import { withAppBar, withAppSlot } from "@src/storybook/frames.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Apps/Run Deck",
  component: RunDeckAppWidget,
  args: { state: runDeckState() },
} satisfies Meta<typeof RunDeckAppWidget>

export default meta

type Story = StoryObj<typeof meta>

/** Item icons are served by the backend; without one the buttons fall back to text only. */
export const AppWidget: Story = {
  decorators: [withAppSlot],
}

export const AppWidgetEmpty: Story = {
  args: { state: runDeckState({ sections: [] }) },
  decorators: [withAppSlot],
}

export const AppBarIcon: Story = {
  render: (args) => <RunDeckAppBarIcon {...args} />,
  decorators: [withAppBar],
}
