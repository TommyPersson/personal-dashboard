package apps.weather.application

import framework.AppModule
import apps.weather.application.queries.GetWeatherAppData
import framework.mediator.Mediator
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import jakarta.inject.Inject

class WeatherAppModule @Inject constructor(
    private val mediator: Mediator
) : AppModule {
    override fun setup(app: Application): Unit = with(app) {
        routing {
            get("/api/apps/weather/data") {
                call.respond(mediator.send(GetWeatherAppData()))
            }
        }
    }
}