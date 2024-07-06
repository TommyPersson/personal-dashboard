package apps.mediacontrol.application

import apps.mediacontrol.application.commands.PauseOrPlayMedia
import apps.mediacontrol.application.commands.SkipNextMedia
import apps.mediacontrol.application.commands.SkipPreviousMedia
import apps.mediacontrol.application.queries.GetMediaControlData
import apps.mediacontrol.application.queries.GetMediaThumbnail
import common.contracts.OkResponseDTO
import framework.AppModule
import framework.mediator.Mediator
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import jakarta.inject.Inject

class MediaControlAppModule @Inject constructor(
    private val mediator: Mediator
) : AppModule {
    override fun setup(app: Application) {
        app.routing {
            get("/api/apps/media-control/status") {
                call.respond(mediator.send(GetMediaControlData()))
            }

            get("/api/apps/media-control/thumbnail") {
                val bytes = mediator.send(GetMediaThumbnail())
                if (bytes == null) {
                    call.respond(HttpStatusCode.NotFound)
                } else {
                    call.respondBytes(bytes, ContentType.Image.PNG)
                }
            }

            post("/api/apps/media-control/actions/pause-or-play") {
                mediator.send(PauseOrPlayMedia())
                call.respond(OkResponseDTO())
            }

            post("/api/apps/media-control/actions/skip-next") {
                mediator.send(SkipNextMedia())
                call.respond(OkResponseDTO())
            }

            post("/api/apps/media-control/actions/skip-previous") {
                mediator.send(SkipPreviousMedia())
                call.respond(OkResponseDTO())
            }
        }
    }
}

