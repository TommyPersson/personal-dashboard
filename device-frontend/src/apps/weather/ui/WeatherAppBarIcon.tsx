import { WbSunnyOutlined } from "@mui/icons-material"
import { Badge, IconButton } from "@mui/material"
import { WeatherAppState } from "@src/apps/weather/state/WeatherAppState.ts"
import { AppBarIconPortal } from "@src/common/components/AppBarIconPortal/AppBarIconPortal.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const WeatherAppBarIcon = (props: { state: WeatherAppState }) => {
  const { state } = props

  const badgeContent = state.data ? `${state.data?.currentWeather.temperature}°` : null

  const handleClick = useScrollIntoView("weatherAppWidget")

  return (
    <AppBarIconPortal appIconId={"weather"} order={2000}>
      <IconButton size={"large"} onClick={handleClick}>
        <Badge badgeContent={badgeContent} color={"info"}>
          <WbSunnyOutlined />
        </Badge>
      </IconButton>
    </AppBarIconPortal>
  )
}