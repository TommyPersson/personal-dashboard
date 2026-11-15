import { WeatherDataDTO, WeatherDataSchema } from "@src/apps/weather/models/WeatherData.ts"
import { WeatherAppState } from "@src/apps/weather/state/WeatherAppState.ts"
import { DateTime } from "luxon"
import { http, HttpResponse } from "msw"
import { fn } from "storybook/test"

const icons = ["01d", "02d", "03d", "04d", "09d", "10d", "11d", "13d", "50d"]

const today = DateTime.now().startOf("hour")

/** As the backend sends it. */
export const weatherDataDTO: WeatherDataDTO = {
  cityName: "Stockholm",
  currentWeather: {
    temperature: 14,
    temperatureLow: 9,
    temperatureHigh: 17,
    temperatureFeelsLike: 12,
    weatherIconName: "02d",
    humidityPercent: 62,
  },
  hourlyForecasts: new Array(48).fill(0).map((_, i) => {
    const time = today.plus({ hours: i })
    const isNight = time.hour < 6 || time.hour > 20
    return {
      date: time.toISODate()!,
      time: time.toFormat("HH:mm:ss"),
      temperature: Math.round(12 + 5 * Math.sin(i / 4)),
      temperatureFeelsLike: Math.round(10 + 5 * Math.sin(i / 4)),
      weatherIconName: icons[i % icons.length].replace("d", isNight ? "n" : "d"),
      humidityPercent: 50 + (i * 7) % 40,
    }
  }),
  dailyForecasts: new Array(7).fill(0).map((_, i) => ({
    date: today.plus({ days: i + 1 }).toISODate()!,
    temperatureLow: 7 + (i % 3),
    temperatureHigh: 16 + (i % 4),
    weatherIconName: icons[(i * 2) % icons.length],
    humidityPercent: 45 + i * 5,
  })),
}

export const weatherData = WeatherDataSchema.parse(weatherDataDTO)

export function weatherState(overrides: Partial<WeatherAppState> = {}): WeatherAppState {
  return {
    data: weatherData,
    isLoading: false,
    lastFetchedAt: DateTime.now(),
    refresh: fn(),
    ...overrides,
  }
}

export const weatherHandlers = [
  http.get("/api/apps/weather/data", () => HttpResponse.json(weatherDataDTO)),
]
