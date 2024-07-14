package apps.calendar.application.config

data class CalendarAppConfig(
    val googleCalendar: GoogleCalendar
) {
    data class GoogleCalendar(
        val emailAddress: String,
        val calendars: List<String>,
        val clientSecretJsonFilePath: String,
    )
}
