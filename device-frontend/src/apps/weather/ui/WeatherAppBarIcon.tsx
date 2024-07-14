import { WbSunnyOutlined } from "@mui/icons-material"
import { WeatherAppState } from "@src/apps/weather/state/WeatherAppState.ts"
import { AppBarIcon } from "@src/common/components/AppBarIcon/AppBarIcon.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const WeatherAppBarIcon = React.memo((props: { state: WeatherAppState }) => {
  const { state } = props

  const badgeContent = state.data ? `${state.data?.currentWeather.temperature}°` : null

  const handleClick = useScrollIntoView("weatherAppWidget")

  return (
    <AppBarIcon
      id={"weather"}
      order={2000}
      icon={<WbSunnyOutlined />}
      badgeProps={{
        badgeContent: badgeContent,
        color: "info",
      }}
      onClick={handleClick}
    />
  )
})