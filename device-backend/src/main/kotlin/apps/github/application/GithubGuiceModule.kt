package apps.github.application

import apps.github.application.commands.MarkAllGithubNotificationsAsReadCommandHandler
import apps.github.application.config.GithubAppConfig
import apps.github.application.queries.GetGithubNotificationsQueryHandler
import apps.github.domain.GithubApiClient
import apps.github.infrastructure.GithubApiClientImpl
import com.google.inject.Binder
import com.google.inject.Module
import framework.guice.bindAppConfig
import framework.guice.bindAppModule
import framework.guice.bindRequestHandler

class GithubGuiceModule : Module {
    override fun configure(binder: Binder) {
        binder.bindAppModule<GithubAppModule>()
        binder.bindAppConfig<GithubAppConfig>("github")
        binder.bindRequestHandler<GetGithubNotificationsQueryHandler>()
        binder.bindRequestHandler<MarkAllGithubNotificationsAsReadCommandHandler>()
        binder.bind(GithubApiClient::class.java).to(GithubApiClientImpl::class.java)
    }
}