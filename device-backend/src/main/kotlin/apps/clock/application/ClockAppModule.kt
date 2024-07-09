package apps.clock.application

import apps.clock.application.queries.GetCurrentTime
import framework.AppModule
import framework.mediator.Mediator
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import jakarta.inject.Inject

class ClockAppModule @Inject constructor(
    private val mediator: Mediator,
) : AppModule {
    override fun setup(app: Application) {
        app.routing {
            get("/api/apps/clock/current-time") {
                call.respond(mediator.send(GetCurrentTime()))
            }
        }
    }
}