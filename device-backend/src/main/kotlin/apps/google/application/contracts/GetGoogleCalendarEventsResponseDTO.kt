package apps.google.application.contracts

import java.time.Instant

data class GetGoogleCalendarEventsResponseDTO(
    val events: List<Event>
) {
    data class Event(
        val id: String,
        val calendarName: String,
        val summary: String,
        val startTime: Instant,
        val endTime: Instant,
    )
}