package apps.weather.infrastructure

import apps.weather.application.config.WeatherAppConfig
import apps.weather.domain.WeatherAppDataProvider
import apps.weather.infrastructure.openweathermap.OpenWeatherWeatherAppDataProvider
import com.google.inject.Provider
import jakarta.inject.Inject

class WeatherAppDataProviderProvider @Inject constructor(
    private val config: WeatherAppConfig
) : Provider<WeatherAppDataProvider> {
    override fun get(): WeatherAppDataProvider {
        return when (config.source) {
            is WeatherAppConfig.Source.OpenWeather -> OpenWeatherWeatherAppDataProvider(config.source)
        }
    }
}