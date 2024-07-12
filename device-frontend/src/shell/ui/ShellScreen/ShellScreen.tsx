import { Lock } from "@mui/icons-material"
import { Box, Divider, Icon, IconButton, Stack } from "@mui/material"
import { BitbucketAppUI } from "@src/apps/bitbucket/ui/BitbucketAppUI.tsx"
import { ClockAppBarWidget } from "@src/apps/clock/ui/ClockAppBarWidget.tsx"
import { ClockAppUI } from "@src/apps/clock/ui/ClockAppUI.tsx"
import { GithubAppUI } from "@src/apps/github/ui/GithubAppUI.tsx"
import { HotKeysAppUI } from "@src/apps/hot-keys/ui/HotKeysAppUI.tsx"
import { MediaControlUI } from "@src/apps/media-control/ui/MediaControlUI.tsx"
import { NotificationsAppWidget } from "@src/apps/notifications/ui/NotificationsAppWidget.tsx"
import { PomodoroTimerAppUI } from "@src/apps/pomodoro-timer/ui/PomodoroTimerAppUI.tsx"
import { RunDeckAppUI } from "@src/apps/run-deck/ui/RunDeckAppUI.tsx"
import { WeatherAppUI } from "@src/apps/weather/ui/WeatherAppUI.tsx"
import { AppContext } from "@src/shell/state/ShellState.tsx"
import React, { useContext } from "react"

import "../../infrastructure/Timer"

import classes from "./ShellScreen.module.scss"

type AppWidgetProvider = {
  id: string
  title: string
  factory: () => React.ReactElement,
}

const appWidgets: AppWidgetProvider[] = [
  {
    id: "clock-app",
    title: "Clock",
    factory: () => <ClockAppUI />,
  },
  {
    id: "pomodoro-app",
    title: "Pomodoro Timer",
    factory: () => <PomodoroTimerAppUI />,
  },
  {
    id: "weather-app",
    title: "Weather",
    factory: () => <WeatherAppUI />,
  },
  {
    id: "media-control-app",
    title: "Media Control",
    factory: () => <MediaControlUI />,
  },
  {
    id: "hot-keys-app",
    title: "Hot Keys",
    factory: () => <HotKeysAppUI />,
  },
  {
    id: "run-deck-app",
    title: "Run Deck",
    factory: () => <RunDeckAppUI />,
  },
  {
    id: "bitbucket-app",
    title: "Bitbucket",
    factory: () => <BitbucketAppUI />,
  },
  {
    id: "github-app",
    title: "Github",
    factory: () => <GithubAppUI />,
  },
]

export const ShellScreen = () => {
  const appContext = useContext(AppContext)
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
      <div className={classes.AppBarSlot}>
        <IconButton size={"large"} onClick={appContext.lock}>
          <Lock />
        </IconButton>
        <Box flex={1} />
        <div id={"appBarPortal"} className={classes.AppBarPortal}></div>
        <Divider />
        <ClockAppBarWidget />
      </div>
    </div>
  )
}