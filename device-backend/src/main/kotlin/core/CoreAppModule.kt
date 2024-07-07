package core

import common.contracts.OkResponseDTO
import core.notifications.application.commands.DismissNotification
import core.notifications.application.commands.PostNotification
import core.notifications.application.contracts.NotificationDTO
import core.notifications.application.queries.GetNotifications
import framework.AppModule
import framework.mediator.Mediator
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.util.*
import jakarta.inject.Inject

class CoreAppModule @Inject constructor(
    private val mediator: Mediator
): AppModule {
    override fun setup(app: Application) {
        app.routing {
            get("/api/notifications") {
                call.respond(mediator.send(GetNotifications()))
            }
            post("/api/notifications") {
                val notification = call.receive<NotificationDTO>()
                mediator.send(PostNotification(notification))
                call.respond(OkResponseDTO())
            }
            post("/api/notifications/{id}/actions/dismiss") {
                val notificationId = call.parameters.getOrFail("id")
                mediator.send(DismissNotification(notificationId))
                call.respond(OkResponseDTO())
            }
        }
    }
}