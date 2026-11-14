package apps.claude.application

import apps.claude.application.commands.DiscardClaudeSessionCommandHandler
import apps.claude.application.commands.HandleClaudeHookEventCommandHandler
import apps.claude.application.queries.GetClaudeSessionsQueryHandler
import apps.claude.domain.ClaudeSessionRepository
import apps.claude.infrastructure.ClaudeSessionRepositoryImpl
import com.google.inject.Binder
import com.google.inject.Module
import framework.guice.bindAppModule
import framework.guice.bindRequestHandler

class ClaudeGuiceModule : Module {
    override fun configure(binder: Binder) {
        binder.bindAppModule<ClaudeAppModule>()
        binder.bindRequestHandler<HandleClaudeHookEventCommandHandler>()
        binder.bindRequestHandler<DiscardClaudeSessionCommandHandler>()
        binder.bindRequestHandler<GetClaudeSessionsQueryHandler>()
        binder.bind(ClaudeSessionRepository::class.java).to(ClaudeSessionRepositoryImpl::class.java)
    }
}
