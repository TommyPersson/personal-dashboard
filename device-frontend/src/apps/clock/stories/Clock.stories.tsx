import { clockHandlers, clockState } from "@src/apps/clock/stories/clockFixtures.ts"
import { ClockAppBarWidget } from "@src/apps/clock/ui/ClockAppBarWidget.tsx"
import { ClockLockScreenWidget } from "@src/apps/clock/ui/ClockLockScreenWidget.tsx"
import { withLockScreen } from "@src/storybook/frames.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"

import shellClasses from "@src/shell/ui/ShellScreen/ShellScreen.module.scss"

const meta = {
  title: "Apps/Clock",
  component: ClockLockScreenWidget,
  args: { state: clockState() },
} satisfies Meta<typeof ClockLockScreenWidget>

export default meta

type Story = StoryObj<typeof meta>

export const LockScreenWidget: Story = {
  decorators: [withLockScreen],
}

/** Fetches the current time itself, served here by MSW. */
export const AppBarWidget: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "flex-end", height: "100vh" }}>
      <div className={shellClasses.AppBarSlot}>
        <ClockAppBarWidget />
      </div>
    </div>
  ),
  parameters: { msw: { handlers: { clock: clockHandlers } } },
}
