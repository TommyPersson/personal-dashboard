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
import { WeatherDataEntity } from "@src/apps/weather/entities/WeatherDataEntity.ts"
import { CurrentWeather, DailyForecast, HourlyForecast } from "@src/apps/weather/modes/WeatherData.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import React, { useMemo } from "react"

import classes from "./WeatherAppWidget.module.scss"


export const WeatherAppWidget = () => {
  const data = useWeatherData()

  const refreshButton = (
    <Button
      children={"Refresh"}
      startIcon={<RefreshOutlined />}
      onClick={data.fetchAsync}
    />
  )

  const content = data.isLoading || !data.value ? (
    <Stack alignItems={"center"} padding={10}>
      <CircularProgress />
    </Stack>
  ) : (
    <>
      <CurrentWeatherCard
        cityName={data.value?.cityName}
        current={data.value?.currentWeather}
      />
      <Typography
        variant={"caption"}
        className={classes.LastRefreshedAtText}
        children={`Last refreshed at ${formatTime(data.lastFetchedAt!)}`}
      />
      <Next48HoursCard
        forecasts={data.value?.hourlyForecasts ?? []}
      />
      <ComingDaysForecastCard
        forecasts={data.value?.dailyForecasts ?? []}
      />
    </>
  )

  return (
    <AppWidget className={classes.WeatherAppWidget}>
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
}


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
          <WeatherIcon iconName={current.weatherIconName} />
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
      <WeatherIcon iconName={forecast.weatherIconName} />
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
      <TableCell><WeatherIcon iconName={forecast.weatherIconName} /></TableCell>
      <TableCell>{forecast.temperatureHigh}°</TableCell>
      <TableCell>{forecast.temperatureLow}°</TableCell>
    </TableRow>
  )
}

const WeatherIcon = (props: { iconName: string }) => {
  const src = formatIconUrl(props.iconName)
  return <img className={classes.WeatherIcon} src={src} alt={""} />
}

function formatIconUrl(iconName: string): string {
  return `/assets/apps/weather/icons/${iconName}@4x.png`
}

function formatDay(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long" })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })
}


function useWeatherData() {
  const data = useEntity(WeatherDataEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  useInterval(data.fetchAsync, 5 * 60 * 1000) // 5 minutes

  return data
}