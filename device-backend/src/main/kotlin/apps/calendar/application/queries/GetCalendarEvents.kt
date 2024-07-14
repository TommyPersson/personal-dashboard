package apps.calendar.application.queries

import apps.calendar.application.config.CalendarAppConfig
import apps.calendar.application.contracts.GetCalendarEventsResponseDTO
import com.google.api.client.util.DateTime
import com.google.api.services.calendar.Calendar
import com.google.api.services.calendar.model.Events
import com.google.inject.Provider
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject
import java.time.Instant

data class GetCalendarEvents(
    val minTime: Instant,
    val maxTime: Instant,
) : Query<GetCalendarEventsResponseDTO>

class GetGoogleCalendarEventsQueryHandler @Inject constructor(
    private val config: CalendarAppConfig,
    private val calendarApiProvider: Provider<Calendar>,
) : QueryHandler<GetCalendarEvents, GetCalendarEventsResponseDTO> {

    override suspend fun handle(query: GetCalendarEvents): GetCalendarEventsResponseDTO {
        val calendar = calendarApiProvider.get()

        val events = config.googleCalendar.calendars.flatMap { calendarName ->
            val response: Events = calendar.Events()
                .list(calendarName)
                .setTimeMin(DateTime.parseRfc3339(query.minTime.toString()))
                .setTimeMax(DateTime.parseRfc3339(query.maxTime.toString()))
                .setSingleEvents(true)
                .execute()

            response.items.map {
                GetCalendarEventsResponseDTO.Event(
                    id = it.id,
                    calendarName = response.summary,
                    summary = it.summary,
                    startTime = Instant.ofEpochMilli(it.start.dateTime.value),
                    endTime = Instant.ofEpochMilli(it.end.dateTime.value)
                )
            }
        }.sortedBy { it.startTime }

        return GetCalendarEventsResponseDTO(
            events = events
        )
    }
}

