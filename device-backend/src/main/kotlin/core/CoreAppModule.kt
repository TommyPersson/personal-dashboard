package core

import common.contracts.OkResponseDTO
import core.auth.application.commands.UnlockDevice
import core.auth.application.contracts.UnlockDeviceRequestDTO
import core.auth.application.queries.IsDeviceUnlocked
import core.auth.domain.DeviceSessionJWT
import core.layout.application.queries.GetLayout
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
import io.ktor.util.date.*
import jakarta.inject.Inject

class CoreAppModule @Inject constructor(
    private val mediator: Mediator
) : AppModule {
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

            get("/api/layout") {
                call.respond(mediator.send(GetLayout()))
            }

            post("/api/auth/unlock-device") {
                val request = call.receive<UnlockDeviceRequestDTO>()

                try {
                    val result = mediator.send(UnlockDevice(request.pinCode))
                    call.response.setAuthCookie(result)
                    call.respond(OkResponseDTO())
                } catch (e: Exception) {
                    call.response.clearAuthCookie()
                    throw e
                }
            }

            get("/api/auth/is-device-unlocked") {
                val jwt = call.request.cookies["authJwt"]
                val response = mediator.send(IsDeviceUnlocked(jwt))
                if (!response.isDeviceUnlocked) {
                    call.response.clearAuthCookie()
                }
                call.respond(response)
            }

            post("/api/auth/lock-device") {
                call.response.clearAuthCookie()
                call.respond(OkResponseDTO())
            }
        }
    }
}

fun ApplicationResponse.setAuthCookie(jwt: DeviceSessionJWT) {
    cookies.append(
        name = "authJwt",
        value = jwt.jwt,
        httpOnly = true,
    )
}

fun ApplicationResponse.clearAuthCookie() {
    cookies.append(
        name = "authJwt",
        value = "",
        httpOnly = true,
        expires = GMTDate(0)
    )
}