package apps.github.application

import apps.github.application.commands.MarkAllGithubNotificationsAsRead
import apps.github.application.queries.GetGithubNotifications
import common.contracts.OkResponseDTO
import framework.AppModule
import framework.mediator.Mediator
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import jakarta.inject.Inject

class GithubAppModule @Inject constructor(
    private val mediator: Mediator
) : AppModule {
    override fun setup(app: Application) {
        app.routing {
            get("/api/apps/github/notifications") {
                call.respond(mediator.send(GetGithubNotifications()))
            }

            post("/api/apps/github/notifications/actions/mark-all-as-read") {
                mediator.send(MarkAllGithubNotificationsAsRead())
                call.respond(OkResponseDTO())
            }
        }
    }
}