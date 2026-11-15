import { Typography } from "@mui/material"
import { DurationText } from "@src/common/components/DurationText/DurationText.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Duration } from "luxon"

const meta = {
  title: "Common/DurationText",
  component: DurationText,
  args: {
    value: Duration.fromObject({ minutes: 4, seconds: 7 }),
  },
  decorators: [
    (Story) => <Typography sx={{ p: 2 }}><Story /></Typography>,
  ],
} satisfies Meta<typeof DurationText>

export default meta

type Story = StoryObj<typeof meta>

export const CompactSeconds: Story = {
  args: { value: Duration.fromObject({ seconds: 12.6 }) },
}

export const CompactMinutes: Story = {}

export const CompactHours: Story = {
  args: { value: Duration.fromObject({ hours: 1, minutes: 5, seconds: 30 }) },
}

export const ClockMinutes: Story = {
  args: { format: "clock" },
}

export const ClockHours: Story = {
  args: { value: Duration.fromObject({ hours: 1, minutes: 5 }), format: "clock" },
}

/** E.g. a prompt end time that is slightly before its start time. */
export const Negative: Story = {
  args: { value: Duration.fromObject({ seconds: -3 }) },
}
