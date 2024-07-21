package apps.calendar.domain

import java.time.Instant

data class CalendarEvent(
    val id: String,
    val calendarName: String,
    val summary: String,
    val startTime: Instant,
    val endTime: Instant,
)