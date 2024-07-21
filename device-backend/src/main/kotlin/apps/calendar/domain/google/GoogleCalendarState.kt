package apps.calendar.domain.google

import apps.calendar.application.config.CalendarAppConfig
import apps.calendar.domain.CalendarAuthenticator
import apps.calendar.domain.CalendarEvent
import apps.calendar.domain.CalendarState
import com.google.api.client.http.HttpResponseException
import com.google.api.client.util.DateTime
import com.google.api.services.calendar.model.Event
import jakarta.inject.Inject
import jakarta.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import org.slf4j.LoggerFactory
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.util.*

@Singleton
class GoogleCalendarState @Inject constructor(
    private val config: CalendarAppConfig.CalendarProvider.Google,
    private val calendarApiProvider: GoogleCalendarApiProvider,
) : CalendarState {
    private val logger = LoggerFactory.getLogger(GoogleCalendarState::class.java)

    private val stateByCalendarId = Collections.synchronizedMap(mutableMapOf<String, SingleCalendarState>())
    private val stateMutex = Mutex()

    private val calendarIds = config.calendars

    override val id = "google:${config.emailAddress}"

    override val authenticator = object : CalendarAuthenticator {
        override val name: String
            get() = config.emailAddress

        override suspend fun authenticate() {
            calendarApiProvider.credentialsProvider.refresh()
        }
    }

    override suspend fun refresh() {
        stateMutex.withLock {
            try {
                refreshCalendarState()
            } catch (e: HttpResponseException) {
                if (e.statusCode == 410) {
                    // Server state has been reset, we need to perform a clean sync
                    stateByCalendarId.clear()
                    refreshCalendarState()
                }

                throw e
            }
        }
    }

    override suspend fun get(): List<CalendarEvent> {
        return stateMutex.withLock {
            stateByCalendarId
                .map { it.key to it.value.events.values.toList() }
                .flatMap { (calendarId, events) ->
                    events.map {
                        CalendarEvent(
                            id = it.id,
                            calendarName = calendarId,
                            summary = it.summary,
                            startTime = Instant.ofEpochMilli(it.start.dateTime.value),
                            endTime = Instant.ofEpochMilli(it.end.dateTime.value)
                        )
                    }
                }
        }
    }

    private suspend fun refreshCalendarState() = withContext(Dispatchers.IO) {
        logger.info("Refreshing Google calendar state ...")

        val minTime = LocalDate.now().atStartOfDay(ZoneId.systemDefault())
        val maxTime = minTime.plusDays(14)

        val calendar = calendarApiProvider.get()

        calendarIds.forEach { calendarId ->
            val currentState = stateByCalendarId[calendarId]
                ?: SingleCalendarState(calendarId, null, emptyMap())

            val response = calendar.Events()
                .list(calendarId)
                .setSingleEvents(true)
                .also {
                    if (currentState.nextSyncToken != null) {
                        it.setSyncToken(currentState.nextSyncToken)
                    } else {
                        it.setTimeMin(DateTime.parseRfc3339(minTime.toInstant().toString()))
                        it.setTimeMax(DateTime.parseRfc3339(maxTime.toInstant().toString()))
                    }
                }.execute()

            val newEvents = response.items.filter { it.status != "cancelled" }.associateBy { it.id }
            val cancelledEventIds = response.items.filter { it.status == "cancelled" }.map { it.id }

            stateByCalendarId[calendarId] = currentState.copy(
                nextSyncToken = response.nextSyncToken,
                events = (currentState.events + newEvents).filterKeys { !cancelledEventIds.contains(it) }
            )
        }

        logger.info("Refreshing Google calendar state completed!")
    }

    data class SingleCalendarState(
        val calendarId: String,
        val nextSyncToken: String?,
        val events: Map<String, Event>,
    )
}