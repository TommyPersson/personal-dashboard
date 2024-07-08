import { Divider, Stack } from "@mui/material"
import { BitbucketAppUI } from "@src/apps/bitbucket/ui/BitbucketAppUI.tsx"
import { ClockAppBarWidget } from "@src/apps/clock/ui/ClockAppBarWidget.tsx"
import { HotKeysAppWidget } from "@src/apps/hot-keys/ui/HotKeysAppWidget.tsx"
import { MediaControlUI } from "@src/apps/media-control/ui/MediaControlUI.tsx"
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
    factory: () => <MediaControlUI />,
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
  {
    id: "bitbucket-app",
    title: "Bitbucket",
    factory: () => <BitbucketAppUI />
  }
]

export const ShellScreen = () => {
  return (
    <div className={classes.ShellScreen}>
      <div className={classes.StatusBarSlot}></div>
      <div className={classes.NotificationAreaSlot}>
        <NotificationsAppWidget />
      </div>
      <div id={"appAreaPortal"} className={classes.AppAreaPortal} />
      <div className={classes.AppAreaSlot}>
        <Stack
          direction={"row"}
          spacing={0}
        >
          {appWidgets.map(it => <React.Fragment key={it.id}>{it.factory()}</React.Fragment>)}
        </Stack>
      </div>
      <div id={"appBarSelector"} className={classes.AppSelectorSlot}>
        <div id={"appBarPortal"} className={classes.AppBarPortal}></div>
        <Divider />
        <ClockAppBarWidget />
      </div>
    </div>
  )
}