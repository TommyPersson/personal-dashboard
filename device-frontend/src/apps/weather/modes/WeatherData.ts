export type WeatherData = {
  cityName: string
  currentWeather: CurrentWeather
  hourlyForecasts: HourlyForecast[]
  dailyForecasts: DailyForecast[]
}

export type CurrentWeather = {
  temperature: number
  temperatureLow: number
  temperatureHigh: number
  temperatureFeelsLike: number
  weatherIconName: string
  humidityPercent: number
}

export type DailyForecast = {
  date: string
  temperature: number
  temperatureLow: number
  temperatureHigh: number
  weatherIconName: string
  humidityPercent: number
}

export type HourlyForecast = {
  date: string
  time: string
  temperature: number,
  temperatureFeelsLike: number,
  weatherIconName: string,
  humidityPercent: string,
}

