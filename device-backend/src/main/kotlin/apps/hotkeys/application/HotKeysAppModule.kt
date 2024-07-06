package apps.hotkeys.application

import apps.hotkeys.application.commands.PerformHotKeyAction
import apps.hotkeys.application.queries.GetHotKeysData
import common.contracts.OkResponseDTO
import framework.AppModule
import framework.mediator.Mediator
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import jakarta.inject.Inject
import java.util.*

class HotKeysAppModule @Inject constructor(
    private val mediator: Mediator
) : AppModule {
    override fun setup(app: Application) {
        app.routing {
            get("/api/apps/hot-keys/data") {
                call.respond(mediator.send(GetHotKeysData()))
            }

            post("/api/apps/hot-keys/{hotKeyId}/actions/perform") {
                val hotKeyId = call.parameters["hotKeyId"].let { UUID.fromString(it) }
                mediator.send(PerformHotKeyAction(hotKeyId))
                call.respond(OkResponseDTO())
            }
        }
    }
}