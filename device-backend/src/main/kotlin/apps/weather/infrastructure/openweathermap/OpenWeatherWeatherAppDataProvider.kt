package apps.weather.infrastructure.openweathermap

import apps.weather.application.config.WeatherAppConfig
import apps.weather.application.contracts.WeatherAppDataResponseDTO
import apps.weather.domain.Location
import apps.weather.infrastructure.openweathermap.contracts.OneCallResponseDTO
import apps.weather.domain.WeatherAppDataProvider
import com.fasterxml.jackson.databind.ObjectMapper
import java.time.Instant
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.ZonedDateTime
import kotlin.math.roundToInt

class OpenWeatherWeatherAppDataProvider(
    config: WeatherAppConfig.Source.OpenWeather,
    objectMapper: ObjectMapper,
) : WeatherAppDataProvider {

    private val client = OpenWeatherMapApiClient(config, objectMapper)

    override suspend fun get(location: Location): WeatherAppDataResponseDTO {
        val oneCallResponse = client.oneCall(location)

        val currentWeather = getCurrentWeather(oneCallResponse)
        val hourlyForecasts = getHourlyForecasts(oneCallResponse)
        val dailyForecasts = getDailyForecasts(oneCallResponse)

        return WeatherAppDataResponseDTO(
            cityName = location.name,
            currentWeather = currentWeather,
            hourlyForecasts = hourlyForecasts,
            dailyForecasts = dailyForecasts
        )
    }

    private fun getCurrentWeather(response: OneCallResponseDTO): WeatherAppDataResponseDTO.CurrentWeather {
        return WeatherAppDataResponseDTO.CurrentWeather(
            temperature = response.current.temp.roundToInt().toDouble(),
            temperatureLow = response.current.temp.roundToInt().toDouble(),
            temperatureHigh = response.current.temp.roundToInt().toDouble(),
            humidityPercent = response.current.humidity,
            temperatureFeelsLike = response.current.feels_like.roundToInt().toDouble(),
            weatherIconName = response.current.weather.first().icon
        )
    }

    private fun getHourlyForecasts(response: OneCallResponseDTO): List<WeatherAppDataResponseDTO.HourlyForecast> {
        return response.hourly
            .map {
                val dateTime = ZonedDateTime.ofInstant(Instant.ofEpochSecond(it.dt), ZoneOffset.systemDefault())

                WeatherAppDataResponseDTO.HourlyForecast(
                    date = dateTime.toLocalDate(),
                    time = dateTime.toLocalTime(),
                    temperature = it.temp.roundToInt().toDouble(),
                    temperatureFeelsLike = it.feels_like.roundToInt().toDouble(),
                    weatherIconName = it.weather.first().icon,
                    humidityPercent = it.humidity,
                )
            }
    }

    private fun getDailyForecasts(response: OneCallResponseDTO): List<WeatherAppDataResponseDTO.DailyForecast> {
        return response.daily
            .map {
                val date = ZonedDateTime.ofInstant(Instant.ofEpochSecond(it.dt), ZoneId.systemDefault()).toLocalDate()

                WeatherAppDataResponseDTO.DailyForecast(
                    date = date,
                    temperatureHigh = it.temp.max.roundToInt().toDouble(),
                    temperatureLow = it.temp.min.roundToInt().toDouble(),
                    weatherIconName = it.weather.first().icon,
                    humidityPercent = it.humidity
                )
            }
    }
}