package core

import apps.hotkeys.application.HotKeysGuiceModule
import apps.mediacontrol.application.MediaControlGuiceModule
import apps.rundeck.application.RunDeckGuiceModule
import apps.weather.application.WeatherGuiceModule
import com.fasterxml.jackson.databind.SerializationFeature
import com.google.inject.Guice
import com.google.inject.Key
import com.google.inject.TypeLiteral
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
import io.ktor.util.logging.*
import kotlinx.coroutines.runBlocking
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.slf4j.event.Level
import java.text.SimpleDateFormat

fun main() {
    val logger = LoggerFactory.getLogger("Main")

    val baseInjector = Guice.createInjector(
        CoreGuiceModule(),
        WeatherGuiceModule(),
        RunDeckGuiceModule(),
        MediaControlGuiceModule(),
        HotKeysGuiceModule(),
    )

    val appModules = baseInjector.getInstance(Key.get(object : TypeLiteral<Set<AppModule>>() {}))

    embeddedServer(Netty, port = 8080) {
        configureContentNegotiations()
        configureCallLogging()
        configureStatusPages(logger)
        configureRouting()

        appModules.forEach {
            it.setup(this)
        }
    }.start(wait = true)
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
        jackson() {
            configure(SerializationFeature.INDENT_OUTPUT, true)
            findAndRegisterModules()
            dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ")
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
        exception<Throwable>() { call, cause ->
            call.respond(HttpStatusCode.InternalServerError)
            logger.error(cause)
            throw cause
        }
    }
}

