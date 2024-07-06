import { Divider, Stack } from "@mui/material"
import { HotKeysAppWidget } from "@src/apps/hot-keys/ui/HotKeysAppWidget.tsx"
import { MediaControlAppWidget } from "@src/apps/media-control/ui/MediaControlAppWidget.tsx"
import { NotificationsAppWidget } from "@src/apps/notifications/ui/NotificationsAppWidget.tsx"
import { PomodoroAppWidget } from "@src/apps/pomodoro/ui/PomodoroAppWidget.tsx"
import { RunDeckAppWidget } from "@src/apps/run-deck/ui/RunDeckAppWidget.tsx"
import { WeatherAppWidget } from "@src/apps/weather/ui/WeatherAppWidget/WeatherAppWidget.tsx"
import React from "react"

import "../../infrastructure/Timer"

import classes from "./ShellScreen.module.scss"

type AppWidgetProvider = {
  id: string
  title: string
  factory: () => React.ReactElement,
}

const appWidgets: AppWidgetProvider[] = [
  {
    id: "pomodoro-app",
    title: "Pomodoro Timer",
    factory: () => <PomodoroAppWidget />,
  },
  {
    id: "weather-app",
    title: "Weather",
    factory: () => <WeatherAppWidget />,
  },
  {
    id: "media-control-app",
    title: "Media Control",
    factory: () => <MediaControlAppWidget />,
  },
  {
    id: "hot-keys-app",
    title: "Hot Keys",
    factory: () => <HotKeysAppWidget />,
  },
  {
    id: "run-deck-app",
    title: "Run Deck",
    factory: () => <RunDeckAppWidget />,
  },
]

export const ShellScreen = () => {
  return (
    <div className={classes.ShellScreen}>
      <div className={classes.StatusBarSlot}></div>
      <div className={classes.NotificationAreaSlot}>
        <NotificationsAppWidget />
      </div>
      <div className={classes.AppAreaSlot}>
        <Stack
          direction={"row"}
          spacing={0}
        >
          {appWidgets.map(it => <React.Fragment key={it.id}>{it.factory()}</React.Fragment>)}
        </Stack>
      </div>
      <div className={classes.AppSelectorSlot}>
        apps bar
      </div>
    </div>
  )
}