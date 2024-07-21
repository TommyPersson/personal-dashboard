package apps.calendar.application.contracts

import apps.calendar.domain.CalendarEvent

data class GetCalendarEventsResponseDTO(
    val events: List<CalendarEvent>
)

