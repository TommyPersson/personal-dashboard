package apps.google.application

import GoogleAppConfig
import apps.google.application.queries.GetGoogleCalendarEventsQueryHandler
import apps.google.domain.GoogleCalendarApiProvider
import com.google.api.services.calendar.Calendar
import com.google.inject.Binder
import com.google.inject.Module
import framework.guice.bindAppConfig
import framework.guice.bindAppModule
import framework.guice.bindRequestHandler

class GoogleGuiceModule : Module {
    override fun configure(binder: Binder) {
        binder.bindAppModule<GoogleAppModule>()
        binder.bindAppConfig<GoogleAppConfig>("google")
        binder.bindRequestHandler<GetGoogleCalendarEventsQueryHandler>()
        binder.bind(Calendar::class.java).toProvider(GoogleCalendarApiProvider::class.java)
    }
}