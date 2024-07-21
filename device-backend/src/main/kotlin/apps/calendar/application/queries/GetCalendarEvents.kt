package apps.calendar.application.queries

import apps.calendar.application.contracts.GetCalendarEventsResponseDTO
import apps.calendar.domain.AggregateCalendarState
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject
import java.time.Instant

data class GetCalendarEvents(
    val minTime: Instant,
    val maxTime: Instant,
) : Query<GetCalendarEventsResponseDTO>

class GetGoogleCalendarEventsQueryHandler @Inject constructor(
    private val calendarState: AggregateCalendarState,
) : QueryHandler<GetCalendarEvents, GetCalendarEventsResponseDTO> {

    override suspend fun handle(query: GetCalendarEvents): GetCalendarEventsResponseDTO {
        val events = calendarState.get().filter { it.startTime >= query.minTime && it.endTime <= query.maxTime }

        return GetCalendarEventsResponseDTO(
            events = events
        )
    }
}

