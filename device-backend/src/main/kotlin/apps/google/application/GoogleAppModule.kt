package apps.google.application

import apps.google.application.queries.GetGoogleCalendarEvents
import apps.google.domain.GoogleCredentialsProvider
import framework.AppModule
import framework.mediator.Mediator
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import jakarta.inject.Inject
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import java.awt.Menu
import java.awt.MenuItem
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

class GoogleAppModule @Inject constructor(
    private val mediator: Mediator,
    private val googleCredentialsProvider: GoogleCredentialsProvider,
) : AppModule {

    private val coroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    override fun setup(app: Application) {
        app.routing {
            get("/api/apps/google/calendar/events") {
                val startOfDay = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()
                val endOfDay = LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant()
                val minTime = call.request.queryParameters["minTime"]?.let { Instant.parse(it) } ?: startOfDay
                val maxTime = call.request.queryParameters["maxTime"]?.let { Instant.parse(it) } ?: endOfDay
                val response = mediator.send(GetGoogleCalendarEvents(minTime = minTime, maxTime = maxTime))
                call.respond(response)
            }
        }
    }

    override val trayIconMenu: Menu = Menu("Google Integration")

    init {
        trayIconMenu.add(MenuItem("Authenticate ...").also {
            it.addActionListener { e ->
                coroutineScope.launch {
                    googleCredentialsProvider.refresh()
                    trayIconMenu.removeAll()
                    trayIconMenu.add(MenuItem("Authenticated")) // TODO allow log out / detect credential status
                }
            }
        })
    }
}