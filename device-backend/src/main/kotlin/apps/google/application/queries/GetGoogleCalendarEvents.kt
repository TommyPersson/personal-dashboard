package apps.google.application.queries

import GoogleAppConfig
import apps.google.application.contracts.GetGoogleCalendarEventsResponseDTO
import com.google.api.client.util.DateTime
import com.google.api.services.calendar.Calendar
import com.google.api.services.calendar.model.Events
import com.google.inject.Provider
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject
import java.time.Instant

data class GetGoogleCalendarEvents(
    val minTime: Instant,
    val maxTime: Instant,
) : Query<GetGoogleCalendarEventsResponseDTO>

class GetGoogleCalendarEventsQueryHandler @Inject constructor(
    private val config: GoogleAppConfig,
    private val calendarApiProvider: Provider<Calendar>,
) : QueryHandler<GetGoogleCalendarEvents, GetGoogleCalendarEventsResponseDTO> {

    override suspend fun handle(query: GetGoogleCalendarEvents): GetGoogleCalendarEventsResponseDTO {
        val calendar = calendarApiProvider.get()

        val events = config.calendars.flatMap {
            val response: Events = calendar.Events()
                .list(config.calendars.first())
                .setTimeMin(DateTime.parseRfc3339(query.minTime.toString()))
                .setTimeMax(DateTime.parseRfc3339(query.maxTime.toString()))
                .setSingleEvents(true)
                .execute()

            response.items.map {
                GetGoogleCalendarEventsResponseDTO.Event(
                    calendarName = response.summary,
                    summary = it.summary,
                    startTime = Instant.ofEpochMilli(it.start.dateTime.value),
                    endTime = Instant.ofEpochMilli(it.end.dateTime.value)
                )
            }
        }.sortedBy { it.startTime }

        return GetGoogleCalendarEventsResponseDTO(
            events = events
        )
    }
}

