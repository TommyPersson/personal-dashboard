package apps.calendar.domain

import apps.calendar.application.config.CalendarAppConfig
import com.google.api.client.http.HttpResponseException
import com.google.api.client.util.DateTime
import com.google.api.services.calendar.Calendar
import com.google.api.services.calendar.model.Event
import com.google.api.services.calendar.model.Events
import jakarta.inject.Inject
import jakarta.inject.Provider
import jakarta.inject.Singleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import org.slf4j.LoggerFactory
import java.time.*
import java.util.*

@Singleton
class GoogleCalendarState @Inject constructor(
    private val config: CalendarAppConfig,
    private val calendarApiProvider: Provider<Calendar>
) {
    private val logger = LoggerFactory.getLogger(GoogleCalendarState::class.java)

    private val stateByCalendarId = Collections.synchronizedMap(mutableMapOf<String, SingleCalendarState>())
    private val stateMutex = Mutex()

    private val calendarIds = config.googleCalendar.calendars

    suspend fun refresh() {
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

    suspend fun get(): Map<String, List<Event>> {
        return stateMutex.withLock {
            stateByCalendarId.map { it.key to it.value.events.values.toList() }.toMap()
        }
    }

    private suspend fun refreshCalendarState() = withContext(Dispatchers.IO) {
        logger.info("Refreshing Google calendar state ...")

        val minTime = LocalDate.now().atStartOfDay(ZoneId.systemDefault())
        val maxTime = minTime.plusDays(14)

        val calendar = calendarApiProvider.get()

        calendarIds.forEach { calendarId ->
            val currentState = stateByCalendarId[calendarId] ?: SingleCalendarState(calendarId, null, emptyMap())

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