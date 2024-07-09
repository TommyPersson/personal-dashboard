package core

import apps.bitbucket.application.BitbucketGuiceModule
import apps.github.application.GithubGuiceModule
import apps.hotkeys.application.HotKeysGuiceModule
import apps.mediacontrol.application.MediaControlGuiceModule
import apps.rundeck.application.RunDeckGuiceModule
import apps.weather.application.WeatherGuiceModule
import com.google.inject.Guice
import com.google.inject.Key
import com.google.inject.TypeLiteral
import common.services.WebSocketService
import utils.JSON
import utils.configureJackson
import framework.AppModule
import io.ktor.http.*
import io.ktor.serialization.jackson.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.callloging.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.util.logging.*
import io.ktor.websocket.*
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.slf4j.event.Level
import java.time.Duration

fun main() {
    val logger = LoggerFactory.getLogger("Main")

    val injector = Guice.createInjector(
        CoreGuiceModule(),
        WeatherGuiceModule(),
        RunDeckGuiceModule(),
        MediaControlGuiceModule(),
        HotKeysGuiceModule(),
        BitbucketGuiceModule(),
        GithubGuiceModule(),
    )

    val appModules = injector.getInstance(Key.get(object : TypeLiteral<Set<AppModule>>() {}))

    val webSocketService = injector.getInstance(WebSocketService::class.java)

    embeddedServer(Netty, port = 8080) {
        configureContentNegotiations()
        configureCallLogging()
        configureStatusPages(logger)
        configureRouting()
        configureWebSockets(webSocketService)

        appModules.forEach {
            it.setup(this)
        }
    }.start(wait = true)
}

private fun Application.configureWebSockets(webSocketService: WebSocketService) {
    install(WebSockets) {
        pingPeriod = Duration.ofSeconds(10)
        timeout = Duration.ofSeconds(60)
        contentConverter = JacksonWebsocketContentConverter(JSON.objectMapper)
    }

    routing {
        webSocket("/api/websocket") {
            webSocketService.startSession(this)

            // TODO move into service
            for (frame in incoming) {
                if (frame is Frame.Text) {
                    val readText = frame.readText()
                    if (readText.contains("\"ping\""))
                        send(Frame.Text("{ \"type\": \"pong\" }"))
                } else {
                    println("Ignoring frame: ${frame.frameType}")
                }
            }
        }
    }
}

private fun Application.configureRouting() {
    routing {
        get("/ping") {
            call.respondText("pong")
        }
    }
}

private fun Application.configureContentNegotiations() {
    install(ContentNegotiation) {
        jackson {
            configureJackson(this)
        }
    }
}

private fun Application.configureCallLogging() {
    install(CallLogging) {
        level = Level.INFO
    }
}

private fun Application.configureStatusPages(logger: Logger) {
    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.respond(HttpStatusCode.InternalServerError)
            logger.error(cause)
            throw cause
        }
    }
}