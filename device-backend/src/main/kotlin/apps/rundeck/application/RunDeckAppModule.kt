package apps.rundeck.application

import framework.AppModule
import apps.rundeck.application.commands.RunItemAction
import apps.rundeck.application.queries.GetRunDeckData
import apps.rundeck.application.queries.GetRunDeckItemIcon
import common.contracts.OkResponseDTO
import framework.mediator.Mediator
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import jakarta.inject.Inject
import java.util.*

class RunDeckAppModule @Inject constructor(
    private val mediator: Mediator
) : AppModule {
    override fun setup(app: Application) {
        app.routing {
            get("/api/apps/run-deck/data") {
                call.respond(mediator.send(GetRunDeckData()))
            }

            get("/api/apps/run-deck/items/{itemId}/icon") {
                val itemId = call.parameters["itemId"]?.let { UUID.fromString(it) }
                    ?: return@get call.respond(HttpStatusCode.BadRequest, "Missing 'itemId' path param'")

                val bytes = mediator.send(GetRunDeckItemIcon(itemId))

                call.respondBytes(bytes, ContentType.Image.PNG)
            }

            post("/api/apps/run-deck/items/{itemId}/actions/run") {
                val itemId = call.parameters["itemId"]?.let { UUID.fromString(it) }
                    ?: return@post call.respond(HttpStatusCode.BadRequest, "Missing 'itemId' query param'")

                mediator.send(RunItemAction(itemId))

                call.respond(OkResponseDTO())
            }
        }
    }
}