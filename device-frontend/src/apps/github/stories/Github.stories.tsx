import { githubState } from "@src/apps/github/stories/githubFixtures.ts"
import { GithubAppBarIcon } from "@src/apps/github/ui/GithubAppBarIcon.tsx"
import { GithubAppWidget } from "@src/apps/github/ui/GithubAppWidget.tsx"
import { GithubLockScreenIcon } from "@src/apps/github/ui/GithubLockScreenIcon.tsx"
import { withAppBar, withAppSlot, withLockScreen } from "@src/storybook/frames.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Apps/Github",
  component: GithubAppWidget,
  args: { state: githubState() },
} satisfies Meta<typeof GithubAppWidget>

export default meta

type Story = StoryObj<typeof meta>

export const AppWidget: Story = {
  decorators: [withAppSlot],
}

export const AppWidgetEmpty: Story = {
  args: { state: githubState({ notifications: [] }) },
  decorators: [withAppSlot],
}

export const AppBarIcon: Story = {
  render: (args) => <GithubAppBarIcon {...args} />,
  decorators: [withAppBar],
}

export const LockScreenIcon: Story = {
  render: (args) => <GithubLockScreenIcon {...args} />,
  decorators: [withLockScreen],
}
