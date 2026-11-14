import { bitbucketState } from "@src/apps/bitbucket/stories/bitbucketFixtures.ts"
import { BitbucketAppBarIcon } from "@src/apps/bitbucket/ui/BitbucketAppBarIcon.tsx"
import { BitbucketAppWidget } from "@src/apps/bitbucket/ui/BitbucketAppWidget.tsx"
import { BitbucketLockScreenIcon } from "@src/apps/bitbucket/ui/BitbucketLockScreenIcon.tsx"
import { withAppBar, withAppSlot, withLockScreen } from "@src/storybook/frames.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Apps/Bitbucket",
  component: BitbucketAppWidget,
  args: { state: bitbucketState() },
} satisfies Meta<typeof BitbucketAppWidget>

export default meta

type Story = StoryObj<typeof meta>

export const AppWidget: Story = {
  decorators: [withAppSlot],
}

export const AppWidgetEmpty: Story = {
  args: { state: bitbucketState({ pullRequests: [] }) },
  decorators: [withAppSlot],
}

export const AppWidgetError: Story = {
  args: { state: bitbucketState({ error: new Error("Unable to reach Bitbucket") }) },
  decorators: [withAppSlot],
}

export const AppBarIcon: Story = {
  render: (args) => <BitbucketAppBarIcon {...args} />,
  decorators: [withAppBar],
}

export const LockScreenIcon: Story = {
  render: (args) => <BitbucketLockScreenIcon {...args} />,
  decorators: [withLockScreen],
}
