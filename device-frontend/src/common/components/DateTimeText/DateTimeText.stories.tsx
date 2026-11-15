import { Typography } from "@mui/material"
import { DateTimeText } from "@src/common/components/DateTimeText/DateTimeText.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { DateTime } from "luxon"

const meta = {
  title: "Common/DateTimeText",
  component: DateTimeText,
  args: {
    value: DateTime.fromISO("2026-11-14T18:41:00Z"),
  },
  decorators: [
    (Story) => <Typography sx={{ p: 2 }}><Story /></Typography>,
  ],
} satisfies Meta<typeof DateTimeText>

export default meta

type Story = StoryObj<typeof meta>

export const DateAndTime: Story = {}

export const DateOnly: Story = {
  args: { format: "date" },
}

export const Time: Story = {
  args: { format: "time" },
}

/** API payloads carry ISO 8601 strings, which can be passed as is. */
export const IsoString: Story = {
  args: { value: "2026-11-14T18:41:00Z", format: "time" },
}

export const Invalid: Story = {
  args: { value: "not a timestamp" },
}
