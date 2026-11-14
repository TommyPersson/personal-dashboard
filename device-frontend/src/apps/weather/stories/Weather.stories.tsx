import { weatherState } from "@src/apps/weather/stories/weatherFixtures.ts"
import { WeatherAppBarIcon } from "@src/apps/weather/ui/WeatherAppBarIcon.tsx"
import { WeatherAppWidget } from "@src/apps/weather/ui/WeatherAppWidget.tsx"
import { WeatherLockScreenWidget } from "@src/apps/weather/ui/WeatherLockScreenWidget.tsx"
import { withAppBar, withAppSlot, withLockScreen } from "@src/storybook/frames.tsx"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Apps/Weather",
  component: WeatherAppWidget,
  args: { state: weatherState() },
} satisfies Meta<typeof WeatherAppWidget>

export default meta

type Story = StoryObj<typeof meta>

export const AppWidget: Story = {
  decorators: [withAppSlot],
}

export const AppWidgetLoading: Story = {
  args: { state: weatherState({ data: null, isLoading: true, lastFetchedAt: null }) },
  decorators: [withAppSlot],
}

export const LockScreenWidget: Story = {
  render: (args) => <WeatherLockScreenWidget {...args} />,
  decorators: [withLockScreen],
}

export const AppBarIcon: Story = {
  render: (args) => <WeatherAppBarIcon {...args} />,
  decorators: [withAppBar],
}
