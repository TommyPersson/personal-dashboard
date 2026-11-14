import { WbSunnyOutlined } from "@mui/icons-material"
import { Button, Card, CardContent, Typography } from "@mui/material"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { withAppSlot } from "@src/storybook/frames.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Common/AppWidget",
  component: AppWidget,
  decorators: [withAppSlot],
  args: {
    style: { width: 400 },
    error: null,
    children: (
      <>
        <AppWidgetHeader
          title={"Example"}
          icon={<WbSunnyOutlined />}
          rightContent={<Button children={"Action"} />}
        />
        <Card>
          <CardContent>
            <Typography children={"Widget content"} />
          </CardContent>
        </Card>
      </>
    ),
  },
} satisfies Meta<typeof AppWidget>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  args: { error: new Error("Something went wrong") },
}
