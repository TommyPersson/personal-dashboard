package apps.calendar.application.queries

import apps.calendar.application.contracts.GetCalendarEventsResponseDTO
import apps.calendar.domain.GoogleCalendarState
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject
import java.time.Instant

data class GetCalendarEvents(
    val minTime: Instant,
    val maxTime: Instant,
) : Query<GetCalendarEventsResponseDTO>

class GetGoogleCalendarEventsQueryHandler @Inject constructor(
    private val calendarState: GoogleCalendarState,
) : QueryHandler<GetCalendarEvents, GetCalendarEventsResponseDTO> {

    override suspend fun handle(query: GetCalendarEvents): GetCalendarEventsResponseDTO {
        val events = calendarState.get().flatMap { (calendarId, events) ->
            events.map {
                GetCalendarEventsResponseDTO.Event(
                    id = it.id,
                    calendarName = calendarId,
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

