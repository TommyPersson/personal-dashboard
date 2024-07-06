package apps.rundeck.application

import apps.rundeck.application.commands.RunItemActionCommandHandler
import apps.rundeck.application.config.RunDeckAppConfig
import apps.rundeck.application.queries.GetRunDeckDataQueryHandler
import apps.rundeck.application.queries.GetRunDeckItemIconQueryHandler
import apps.rundeck.domain.IconProvider
import apps.rundeck.infrastructure.IconProviderImpl
import com.google.inject.Binder
import com.google.inject.Module
import framework.guice.bindAppConfig
import framework.guice.bindAppModule
import framework.guice.bindRequestHandler


class RunDeckGuiceModule: Module {
    override fun configure(binder: Binder) {
        binder.bindAppModule<RunDeckAppModule>()
        binder.bindAppConfig<RunDeckAppConfig>("run-deck")
        binder.bindRequestHandler<GetRunDeckDataQueryHandler>()
        binder.bindRequestHandler<GetRunDeckItemIconQueryHandler>()
        binder.bindRequestHandler<RunItemActionCommandHandler>()
        binder.bind(IconProvider::class.java).to(IconProviderImpl::class.java)
    }
}

