package apps.claude.application.commands

import apps.claude.application.contracts.messages.ClaudeSessionRemovedMessageDTO
import apps.claude.domain.ClaudeSessionRepository
import common.services.MessagePublisher
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject

/** Forgets every session, like [DiscardClaudeSession] does for one. */
class DiscardAllClaudeSessions : Command<Unit>

class DiscardAllClaudeSessionsCommandHandler @Inject constructor(
    private val repository: ClaudeSessionRepository,
    private val messagePublisher: MessagePublisher,
) : CommandHandler<DiscardAllClaudeSessions, Unit> {

    override suspend fun handle(command: DiscardAllClaudeSessions) {
        for (id in repository.removeAll()) {
            messagePublisher.publish(ClaudeSessionRemovedMessageDTO(id))
        }
    }
}
