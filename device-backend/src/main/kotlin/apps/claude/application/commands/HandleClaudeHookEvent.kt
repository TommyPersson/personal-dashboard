package apps.claude.application.commands

import apps.claude.application.contracts.messages.ClaudeSessionRemovedMessageDTO
import apps.claude.application.contracts.messages.ClaudeSessionUpdatedMessageDTO
import apps.claude.application.contracts.toDTO
import apps.claude.domain.ClaudeHookEvent
import apps.claude.domain.ClaudeSession
import apps.claude.domain.ClaudeSessionRepository
import apps.claude.domain.apply
import common.services.MessagePublisher
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject
import java.time.Clock

class HandleClaudeHookEvent(val event: ClaudeHookEvent) : Command<Unit>

class HandleClaudeHookEventCommandHandler @Inject constructor(
    private val repository: ClaudeSessionRepository,
    private val messagePublisher: MessagePublisher,
) : CommandHandler<HandleClaudeHookEvent, Unit> {

    private val clock = Clock.systemUTC()

    override suspend fun handle(command: HandleClaudeHookEvent) {
        val event = command.event
        val sessionId = event.sessionId ?: return

        println("command.event: ${event.notificationType}")

        if (event.isSessionEnd) {
            if (repository.remove(sessionId)) {
                messagePublisher.publish(ClaudeSessionRemovedMessageDTO(sessionId))
            }
            return
        }

        val now = clock.instant()
        val session = repository.update(sessionId) { existing ->
            (existing ?: ClaudeSession.new(sessionId, event.cwd, now)).apply(event, now)
        }

        messagePublisher.publish(ClaudeSessionUpdatedMessageDTO(session.toDTO()))
    }
}
