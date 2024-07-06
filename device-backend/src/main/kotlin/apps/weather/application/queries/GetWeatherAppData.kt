package apps.weather.application.queries

import apps.weather.application.config.WeatherAppConfig
import apps.weather.application.contracts.WeatherAppDataResponseDTO
import apps.weather.domain.Location
import apps.weather.domain.WeatherAppDataProvider
import com.sksamuel.aedile.core.cacheBuilder
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject
import kotlin.time.Duration.Companion.minutes


class GetWeatherAppData : Query<WeatherAppDataResponseDTO>

class GetWeatherAppDataQueryHandler @Inject constructor(
    private val dataProvider: WeatherAppDataProvider,
    private val config: WeatherAppConfig
) : QueryHandler<GetWeatherAppData, WeatherAppDataResponseDTO> {

    private val cache = cacheBuilder<Location, WeatherAppDataResponseDTO> {
        expireAfterWrite = 5.minutes
    }.build(::load)

    override suspend fun handle(query: GetWeatherAppData): WeatherAppDataResponseDTO {
        return cache.get(config.location)
    }

    private suspend fun load(location: Location): WeatherAppDataResponseDTO {
        return dataProvider.get(location)
    }
}

