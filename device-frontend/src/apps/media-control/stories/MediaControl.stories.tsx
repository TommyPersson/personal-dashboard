import { mediaControlState, pausedStatus } from "@src/apps/media-control/stories/mediaControlFixtures.ts"
import { MediaControlAppBarIcon } from "@src/apps/media-control/ui/MediaControlAppBarIcon.tsx"
import { MediaControlLockScreenWidget } from "@src/apps/media-control/ui/MediaControlLockScreenWidget.tsx"
import { MediaControlOverlay } from "@src/apps/media-control/ui/MediaControlOverlay.tsx"
import { withAppArea, withAppBar, withLockScreen } from "@src/storybook/frames.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"

/** The album art thumbnail is served by the backend, so it is blank here. */
const meta = {
  title: "Apps/Media Control",
  component: MediaControlOverlay,
  args: { state: mediaControlState() },
} satisfies Meta<typeof MediaControlOverlay>

export default meta

type Story = StoryObj<typeof meta>

export const Overlay: Story = {
  decorators: [withAppArea],
}

export const OverlayPaused: Story = {
  args: { state: mediaControlState({ status: pausedStatus }) },
  decorators: [withAppArea],
}

export const OverlayNothingPlaying: Story = {
  args: { state: mediaControlState({ status: null }) },
  decorators: [withAppArea],
}

export const LockScreenWidget: Story = {
  render: (args) => <MediaControlLockScreenWidget {...args} />,
  decorators: [withLockScreen],
}

export const AppBarIcon: Story = {
  render: (args) => <MediaControlAppBarIcon {...args} />,
  decorators: [withAppBar],
}

export const AppBarIconNothingPlaying: Story = {
  args: { state: mediaControlState({ status: null, isMinimized: true }) },
  render: (args) => <MediaControlAppBarIcon {...args} />,
  decorators: [withAppBar],
}
