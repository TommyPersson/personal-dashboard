import { RefreshOutlined, WaterDropOutlined, WbSunnyOutlined } from "@mui/icons-material"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material"
import { CurrentWeather, DailyForecast, HourlyForecast } from "@src/apps/weather/modes/WeatherData.ts"
import { WeatherAppState } from "@src/apps/weather/state/WeatherAppState.ts"
import { WeatherIcon } from "@src/apps/weather/ui/components/WeatherIcon.tsx"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import React, { useMemo } from "react"

import classes from "./WeatherAppWidget.module.scss"

export const WeatherAppWidget = React.memo((props: { state: WeatherAppState }) => {
  const { state } = props

  const refreshButton = (
    <Button
      children={"Refresh"}
      startIcon={<RefreshOutlined />}
      onClick={state.refresh}
    />
  )

  const content = state.isLoading || !state.data ? (
    <Stack alignItems={"center"} padding={10}>
      <CircularProgress />
    </Stack>
  ) : (
    <>
      <CurrentWeatherCard
        cityName={state.data?.cityName}
        current={state.data?.currentWeather}
      />
      <Typography
        variant={"caption"}
        className={classes.LastRefreshedAtText}
        children={`Last refreshed at ${formatTime(state.lastFetchedAt!)}`}
      />
      <Next48HoursCard
        forecasts={state.data?.hourlyForecasts ?? []}
      />
      <ComingDaysForecastCard
        forecasts={state.data?.dailyForecasts ?? []}
      />
    </>
  )

  return (
    <AppWidget className={classes.WeatherAppWidget} id={"weatherAppWidget"}>
      <Stack spacing={2}>
        <AppWidgetHeader
          title={"Weather"}
          icon={<WbSunnyOutlined />}
          rightContent={refreshButton}
        />
        {content}
      </Stack>
    </AppWidget>
  )
})

const CurrentWeatherCard = (props: { cityName: string, current: CurrentWeather }) => {
  const { cityName, current } = props

  return (
    <Card className={classes.TodayForecastCard}>
      <Stack direction={"row"}>
        <CardContent>
          <Typography children={"Now"} variant={"caption"} />
          <Stack spacing={2}>
            <Stack direction={"row"}>
              <Stack>
                <Typography
                  children={`${current.temperature}°`}
                  variant={"h3"}
                  component={"p"}
                />
                <Typography
                  children={`feels like ${current.temperatureFeelsLike}°`}
                  variant={"subtitle1"}
                  component={"p"}
                />
              </Stack>
            </Stack>
            <Typography children={cityName} variant={"caption"} />
          </Stack>
        </CardContent>
        <Box sx={{ flex: 1 }} />
        <CardContent>
          <WeatherIcon iconName={current.weatherIconName} className={classes.WeatherIcon} />
        </CardContent>
      </Stack>
    </Card>
  )
}

const Next48HoursCard = (props: { forecasts: HourlyForecast[] }) => {
  const { forecasts } = props

  return (
    <Card>
      <CardContent>
        <Typography children={"Next 48 hours"} variant={"caption"} />
      </CardContent>
      <Stack className={classes.HourlyForecastColumns} direction={"row"}>
        {forecasts.map(it => (
          <HourlyForecastColumn key={it.date + it.time} forecast={it} />
        ))}
      </Stack>
    </Card>
  )
}

const HourlyForecastColumn = (props: { forecast: HourlyForecast }) => {
  const { forecast } = props

  return (
    <Stack className={classes.HourlyForecastColumn}>
      <Typography variant={"caption"}>{forecast.time.substring(0, 5)}</Typography>
      <WeatherIcon iconName={forecast.weatherIconName} className={classes.WeatherIcon} />
      <Typography variant={"body2"}>{forecast.temperature}°</Typography>
      <WaterDropOutlined className={classes.HumidityIcon} sx={{ mt: 1 }} />
      <Typography variant={"body2"} color={"text.secondary"}>{forecast.humidityPercent}%</Typography>
    </Stack>
  )
}

const ComingDaysForecastCard = (props: { forecasts: DailyForecast[] }) => {
  const { forecasts } = props

  return (
    <Card>
      <CardContent>
        <Typography children={"Coming days"} variant={"caption"} />
      </CardContent>
      <Table size="small" className={classes.DailyForecastTable}>
        <TableBody>
          {forecasts.map(it => (
            <DailyForecastRow key={it.date} forecast={it} />
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

type WeeklyForecastRowProps = {
  forecast: DailyForecast
}

const DailyForecastRow = (props: WeeklyForecastRowProps) => {
  const { forecast } = props

  const day = useMemo(() => formatDay(new Date(forecast.date)), [forecast.date])

  return (
    <TableRow className={classes.DailyForecastRow}>
      <TableCell>{day}</TableCell>
      <TableCell>
        <Stack direction={"row"} alignItems={"center"}>
          <WaterDropOutlined className={classes.HumidityIcon} /> {forecast.humidityPercent}%
        </Stack>
      </TableCell>
      <TableCell><WeatherIcon iconName={forecast.weatherIconName} className={classes.WeatherIcon} /></TableCell>
      <TableCell>{forecast.temperatureHigh}°</TableCell>
      <TableCell>{forecast.temperatureLow}°</TableCell>
    </TableRow>
  )
}

export function formatDay(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long" })
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })
}
