import { useWeatherAppState } from "@src/apps/weather/state/WeatherAppState.ts"
import { WeatherAppBarIcon } from "@src/apps/weather/ui/WeatherAppBarIcon.tsx"
import { WeatherAppWidget } from "@src/apps/weather/ui/WeatherAppWidget.tsx"
import React from "react"

export const WeatherAppUI = () => {
  const state = useWeatherAppState()

  return (
    <>
      <WeatherAppWidget state={state} />
      <WeatherAppBarIcon state={state} />
    </>
  )
}

