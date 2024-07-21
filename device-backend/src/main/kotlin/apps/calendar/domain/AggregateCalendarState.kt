package apps.calendar.domain

import apps.calendar.application.config.CalendarAppConfig
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class AggregateCalendarState @Inject constructor(
    private val config: CalendarAppConfig,
    private val calendarStateFactory: CalendarStateFactory
) {
    private val calendarStates = config.calendarProviders.map(calendarStateFactory::create)

    val authenticators = calendarStates.map { it.authenticator }

    suspend fun refresh() {
        calendarStates.forEach { it.refresh() }
    }

    suspend fun get(): List<CalendarEvent> {
        val aggregatedEvents = calendarStates
            .flatMap { state -> state.get().map { event -> event.copy(id = "${state.id}:${event.id}") } }
            .sortedBy { it.startTime }

        return aggregatedEvents
    }
}

