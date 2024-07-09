package apps.clock.application

import apps.clock.application.queries.GetCurrentTimeQueryHandler
import com.google.inject.Binder
import com.google.inject.Module
import framework.guice.bindAppModule
import framework.guice.bindRequestHandler

class ClockGuiceModule : Module {
    override fun configure(binder: Binder) {
        binder.bindAppModule<ClockAppModule>()
        binder.bindRequestHandler<GetCurrentTimeQueryHandler>()
    }
}