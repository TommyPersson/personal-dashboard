import { WeatherAppUI } from "@src/apps/weather/ui/WeatherAppUI.tsx"
import { AppWidgetProvider } from "@src/common/AppWidgetProvider.ts"
import React from "react"

export const weatherAppWidgetProvider: AppWidgetProvider = {
  id: "weather-app",
  title: "Weather",
  factory: () => <WeatherAppUI />,
}