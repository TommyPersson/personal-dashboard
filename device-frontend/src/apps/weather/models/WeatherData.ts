import { zx } from "@src/infrastructure/framework/schemas/zx.ts"
import { DateTime } from "luxon"
import { z } from "zod"

export const CurrentWeatherSchema = z.object({
  temperature: z.number(),
  temperatureLow: z.number(),
  temperatureHigh: z.number(),
  temperatureFeelsLike: z.number(),
  weatherIconName: z.string(),
  humidityPercent: z.number(),
})

export type CurrentWeather = z.infer<typeof CurrentWeatherSchema>

export const DailyForecastSchema = z.object({
  /** The start of the day. */
  date: zx.dateTime(),
  temperatureLow: z.number(),
  temperatureHigh: z.number(),
  weatherIconName: z.string(),
  humidityPercent: z.number(),
})

export type DailyForecast = z.infer<typeof DailyForecastSchema>

/** The backend sends the local date and time of the forecast apart; they become a single `time`. */
export const HourlyForecastSchema = z.object({
  date: z.string(),
  time: z.string(),
  temperature: z.number(),
  temperatureFeelsLike: z.number(),
  weatherIconName: z.string(),
  humidityPercent: z.number(),
}).transform(({ date, time, ...rest }, ctx) => {
  const dateTime = DateTime.fromISO(`${date}T${time}`)
  if (!dateTime.isValid) {
    ctx.addIssue({ code: "custom", message: `Invalid forecast time: ${date} ${time}` })
    return z.NEVER
  }
  return { ...rest, time: dateTime }
})

export type HourlyForecast = z.infer<typeof HourlyForecastSchema>

export const WeatherDataSchema = z.object({
  cityName: z.string(),
  currentWeather: CurrentWeatherSchema,
  hourlyForecasts: z.array(HourlyForecastSchema),
  dailyForecasts: z.array(DailyForecastSchema),
})

export type WeatherData = z.infer<typeof WeatherDataSchema>

export type WeatherDataDTO = z.input<typeof WeatherDataSchema>
