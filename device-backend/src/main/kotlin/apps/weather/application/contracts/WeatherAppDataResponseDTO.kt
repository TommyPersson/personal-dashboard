package apps.weather.application.contracts

import java.time.LocalDate
import java.time.LocalTime

data class WeatherAppDataResponseDTO(
    val cityName: String,
    val currentWeather: CurrentWeather,
    val hourlyForecasts: List<HourlyForecast>,
    val dailyForecasts: List<DailyForecast>,
) {
    data class CurrentWeather(
        val temperature: Double,
        val temperatureHigh: Double,
        val temperatureLow: Double,
        val temperatureFeelsLike: Double,
        val weatherIconName: String,
        val humidityPercent: Double,
    )

    data class DailyForecast(
        val date: LocalDate,
        val temperatureHigh: Double,
        val temperatureLow: Double,
        val weatherIconName: String,
        val humidityPercent: Double,
    )

    data class HourlyForecast(
        val date: LocalDate,
        val time: LocalTime,
        val temperature: Double,
        val temperatureFeelsLike: Double,
        val weatherIconName: String,
        val humidityPercent: Double,
    )
}