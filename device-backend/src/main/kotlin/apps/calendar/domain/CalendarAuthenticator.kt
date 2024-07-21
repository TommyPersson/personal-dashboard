package apps.calendar.domain

interface CalendarAuthenticator {
    val name: String
    suspend fun authenticate()
}