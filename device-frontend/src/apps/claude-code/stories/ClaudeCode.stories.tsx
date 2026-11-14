import { claudeCodeState, workingSession } from "@src/apps/claude-code/stories/claudeCodeFixtures.ts"
import { ClaudeCodeAppBarIcon } from "@src/apps/claude-code/ui/ClaudeCodeAppBarIcon.tsx"
import { ClaudeCodeAppWidget } from "@src/apps/claude-code/ui/ClaudeCodeAppWidget.tsx"
import { ClaudeCodeLockScreenIcon } from "@src/apps/claude-code/ui/ClaudeCodeLockScreenIcon.tsx"
import { withAppBar, withAppSlot, withLockScreen } from "@src/storybook/frames.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Apps/Claude Code",
  component: ClaudeCodeAppWidget,
  args: { state: claudeCodeState() },
} satisfies Meta<typeof ClaudeCodeAppWidget>

export default meta

type Story = StoryObj<typeof meta>

export const AppWidget: Story = {
  decorators: [withAppSlot],
}

export const AppWidgetSingleSession: Story = {
  args: { state: claudeCodeState({ sessions: [workingSession] }) },
  decorators: [withAppSlot],
}

export const AppWidgetEmpty: Story = {
  args: { state: claudeCodeState({ sessions: [] }) },
  decorators: [withAppSlot],
}

export const AppBarIcon: Story = {
  render: (args) => <ClaudeCodeAppBarIcon {...args} />,
  decorators: [withAppBar],
}

/** Only shown while a session is waiting for a response. */
export const LockScreenIcon: Story = {
  render: (args) => <ClaudeCodeLockScreenIcon {...args} />,
  decorators: [withLockScreen],
}
