import { Stack, Typography } from "@mui/material"
import { WeatherAppState } from "@src/apps/weather/state/WeatherAppState.ts"
import { WeatherIcon } from "@src/apps/weather/ui/components/WeatherIcon.tsx"
import { LockScreenWidgetPortal } from "@src/common/components/LockScreenWidgetPortal/LockScreenIconPortal.tsx"
import React from "react"

import classes from "./WeatherLockScreenWidget.module.scss"

export const WeatherLockScreenWidget = React.memo((props: { state: WeatherAppState }) => {
  const { state } = props

  if (!state.data) {
    return null
  }

  const currentWeather = state.data.currentWeather

  return (
    <LockScreenWidgetPortal id={"weather-lock-screen-widget"} column={1} order={100}>
      <Stack direction={"row"} className={classes.WeatherLockScreenWidget}>
        <WeatherIcon iconName={currentWeather.weatherIconName} className={classes.WeatherIcon}/>
        <Stack>
          <Typography variant={"h4"} children={`${currentWeather.temperature}°`} />
          <Typography variant={"h6"} children={`feels like ${currentWeather.temperatureFeelsLike}°`} />
        </Stack>
      </Stack>

    </LockScreenWidgetPortal>
  )
})