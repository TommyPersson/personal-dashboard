package apps.claude.application.commands

import apps.claude.application.contracts.messages.ClaudeSessionRemovedMessageDTO
import apps.claude.domain.ClaudeSessionRepository
import common.services.MessagePublisher
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject

/** Forgets a session, e.g. one that ended without a `SessionEnd` event. It comes back if it sends more events. */
class DiscardClaudeSession(val sessionId: String) : Command<Unit>

class DiscardClaudeSessionCommandHandler @Inject constructor(
    private val repository: ClaudeSessionRepository,
    private val messagePublisher: MessagePublisher,
) : CommandHandler<DiscardClaudeSession, Unit> {

    override suspend fun handle(command: DiscardClaudeSession) {
        if (repository.remove(command.sessionId)) {
            messagePublisher.publish(ClaudeSessionRemovedMessageDTO(command.sessionId))
        }
    }
}
