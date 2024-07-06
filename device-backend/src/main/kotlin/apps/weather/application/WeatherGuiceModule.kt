package apps.weather.application

import apps.weather.application.config.WeatherAppConfig
import apps.weather.application.queries.GetWeatherAppDataQueryHandler
import apps.weather.domain.WeatherAppDataProvider
import apps.weather.infrastructure.WeatherAppDataProviderProvider
import com.google.inject.Binder
import com.google.inject.Module
import framework.guice.bindAppConfig
import framework.guice.bindAppModule
import framework.guice.bindRequestHandler

class WeatherGuiceModule : Module {
    override fun configure(binder: Binder) {
        binder.bindAppModule<WeatherAppModule>()
        binder.bindAppConfig<WeatherAppConfig>("weather")

        binder.bindRequestHandler<GetWeatherAppDataQueryHandler>()

        binder.bind(WeatherAppDataProvider::class.java)
            .toProvider(WeatherAppDataProviderProvider::class.java)
    }
}