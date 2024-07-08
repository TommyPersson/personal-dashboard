package apps.bitbucket.application

import apps.bitbucket.application.queries.GetPullRequests
import framework.AppModule
import framework.mediator.Mediator
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import jakarta.inject.Inject

class BitbucketAppModule @Inject constructor(
    private val mediator: Mediator
) : AppModule {
    override fun setup(app: Application) {
        app.routing {
            get("/api/apps/bitbucket/pull-requests") {
                call.respond(mediator.send(GetPullRequests()))
            }
        }
    }
}