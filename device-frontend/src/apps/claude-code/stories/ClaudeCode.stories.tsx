import { claudeCodeState, idleSession, workingSession } from "@src/apps/claude-code/stories/claudeCodeFixtures.ts"
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

/** Claude's last message is shortened by the backend and clamped to four lines. */
export const AppWidgetLongResult: Story = {
  args: {
    state: claudeCodeState({
      sessions: [{
        ...idleSession,
        result: "Added the result message to the session cards. The backend now keeps a shortened, plain-text version "
          + "of Claude's last message when a turn ends and clears it on the next prompt.\n"
          + "• Backend: new result field, with Markdown markers and code blocks removed\n"
          + "• Frontend: shown under the plan while the session is done, clamped to four lines\n"
          + "• Tests: integration test for the summary\n"
          + "Not verified on the device itself.",
      }],
    }),
  },
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
