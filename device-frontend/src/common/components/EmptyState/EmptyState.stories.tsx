import { NotificationsOffOutlined } from "@mui/icons-material"
import { EmptyState } from "@src/common/components/EmptyState/EmptyState.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Common/EmptyState",
  component: EmptyState,
  args: {
    icon: <NotificationsOffOutlined />,
    title: "Nothing here",
    description: "There is nothing to show right now",
  },
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DescriptionOnly: Story = {
  args: { icon: undefined, title: undefined },
}
