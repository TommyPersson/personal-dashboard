package apps.calendar.domain

interface CalendarState {
    val id: String
    val authenticator: CalendarAuthenticator
    suspend fun refresh()
    suspend fun get(): List<CalendarEvent>
}