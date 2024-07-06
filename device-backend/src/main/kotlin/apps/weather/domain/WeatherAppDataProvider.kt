package apps.weather.domain

import apps.weather.application.contracts.WeatherAppDataResponseDTO

interface WeatherAppDataProvider {
    suspend fun get(location: Location): WeatherAppDataResponseDTO
}