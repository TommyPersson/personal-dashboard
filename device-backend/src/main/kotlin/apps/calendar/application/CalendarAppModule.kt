package apps.calendar.application

import apps.calendar.application.queries.GetCalendarEvents
import apps.calendar.domain.GoogleCalendarState
import apps.calendar.domain.GoogleCredentialsProvider
import framework.AppModule
import framework.mediator.Mediator
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import jakarta.inject.Inject
import kotlinx.coroutines.*
import org.slf4j.LoggerFactory
import java.awt.Menu
import java.awt.MenuItem
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

class CalendarAppModule @Inject constructor(
    private val mediator: Mediator,
    private val googleCredentialsProvider: GoogleCredentialsProvider,
    private val googleCalendarState: GoogleCalendarState,
) : AppModule {

    private val logger = LoggerFactory.getLogger(CalendarAppModule::class.java)

    private val coroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    override fun setup(app: Application) {
        app.routing {
            get("/api/apps/calendar/events") {
                val startOfDay = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()
                val endOfDay = LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant()
                val minTime = call.request.queryParameters["minTime"]?.let { Instant.parse(it) } ?: startOfDay
                val maxTime = call.request.queryParameters["maxTime"]?.let { Instant.parse(it) } ?: endOfDay
                val response = mediator.send(GetCalendarEvents(minTime = minTime, maxTime = maxTime))
                call.respond(response)
            }
        }

        coroutineScope.launch {
            while (true) {
                try {
                    googleCalendarState.refresh()
                    delay(5*60*1000)
                } catch (e: Exception) {
                    logger.error("Error during calendar refresh", e)
                    delay(10_000)
                }
            }
        }
    }

    override val trayIconMenu: Menu = Menu("Google Calendar Integration")

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