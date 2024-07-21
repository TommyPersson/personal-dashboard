package apps.calendar.domain

import apps.calendar.application.config.CalendarAppConfig
import apps.calendar.domain.google.GoogleCalendarApiProvider
import apps.calendar.domain.google.GoogleCalendarState
import apps.calendar.domain.google.GoogleCredentialsProvider
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class CalendarStateFactory @Inject constructor() {
    fun create(config: CalendarAppConfig.CalendarProvider): CalendarState {
        return when (config) {
            is CalendarAppConfig.CalendarProvider.Google -> createGoogleCalendarState(config)
        }
    }

    private fun createGoogleCalendarState(config: CalendarAppConfig.CalendarProvider.Google) =
        GoogleCalendarState(
            config = config,
            calendarApiProvider = GoogleCalendarApiProvider(
                credentialsProvider = GoogleCredentialsProvider(
                    config = config
                )
            )
        )
}