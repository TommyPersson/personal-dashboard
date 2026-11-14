import { hotKeysState } from "@src/apps/hot-keys/stories/hotKeysFixtures.ts"
import { HotKeysAppBarIcon } from "@src/apps/hot-keys/ui/HotKeysAppBarIcon.tsx"
import { HotKeysAppWidget } from "@src/apps/hot-keys/ui/HotKeysAppWidget.tsx"
import { withAppBar, withAppSlot } from "@src/storybook/frames.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Apps/Hot Keys",
  component: HotKeysAppWidget,
  args: { state: hotKeysState() },
} satisfies Meta<typeof HotKeysAppWidget>

export default meta

type Story = StoryObj<typeof meta>

export const AppWidget: Story = {
  decorators: [withAppSlot],
}

export const AppWidgetEmpty: Story = {
  args: { state: hotKeysState({ sections: [] }) },
  decorators: [withAppSlot],
}

export const AppBarIcon: Story = {
  render: (args) => <HotKeysAppBarIcon {...args} />,
  decorators: [withAppBar],
}
