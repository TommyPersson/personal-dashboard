import { bitbucketAppWidgetProvider } from "@src/apps/bitbucket/BitbucketAppWidgetProvider.tsx"
import { calendarAppWidgetProvider } from "@src/apps/calendar/CalendarAppWidgetProvider.tsx"
import { clockAppWidgetProvider } from "@src/apps/clock/ClockAppWidgetProvider.tsx"
import { githubAppWidgetProvider } from "@src/apps/github/GithubAppWidgetProvider.tsx"
import { hotKeysAppWidgetProvider } from "@src/apps/hot-keys/HotKeysAppWidgetProvider.tsx"
import { mediaControlAppWidgetProvider } from "@src/apps/media-control/MediaControlAppWidgetProvider.tsx"
import { pomodoroAppWidgetProvider } from "@src/apps/pomodoro-timer/PomodoroAppWidgetProvider.tsx"
import { runDeckAppWidgetProvider } from "@src/apps/run-deck/RunDeckAppWidgetProvider.tsx"
import { weatherAppWidgetProvider } from "@src/apps/weather/WeatherAppWidgetProvider.tsx"
import { AppWidgetProvider } from "@src/common/AppWidgetProvider.ts"

export const allAppWidgetProviders: AppWidgetProvider[] = [
  clockAppWidgetProvider,
  pomodoroAppWidgetProvider,
  weatherAppWidgetProvider,
  calendarAppWidgetProvider,
  mediaControlAppWidgetProvider,
  hotKeysAppWidgetProvider,
  runDeckAppWidgetProvider,
  bitbucketAppWidgetProvider,
  githubAppWidgetProvider,
]