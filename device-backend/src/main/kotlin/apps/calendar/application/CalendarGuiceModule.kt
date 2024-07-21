package apps.calendar.application

import apps.calendar.application.config.CalendarAppConfig
import apps.calendar.application.queries.GetGoogleCalendarEventsQueryHandler
import com.google.inject.Binder
import com.google.inject.Module
import framework.guice.bindAppConfig
import framework.guice.bindAppModule
import framework.guice.bindRequestHandler

class CalendarGuiceModule : Module {
    override fun configure(binder: Binder) {
        binder.bindAppModule<CalendarAppModule>()
        binder.bindAppConfig<CalendarAppConfig>("calendar")
        binder.bindRequestHandler<GetGoogleCalendarEventsQueryHandler>()
    }
}