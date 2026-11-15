package apps.claude.application.commands

import apps.claude.application.contracts.ClaudeSessionDTO
import apps.claude.application.contracts.messages.ClaudeSessionRemovedMessageDTO
import apps.claude.application.contracts.messages.ClaudeSessionUpdatedMessageDTO
import apps.claude.application.contracts.toDTO
import apps.claude.domain.ClaudeHookEvent
import apps.claude.domain.ClaudeSession
import apps.claude.domain.ClaudeSessionEvent
import apps.claude.domain.ClaudeSessionRepository
import common.services.MessagePublisher
import core.notifications.application.commands.PostNotification
import core.notifications.application.contracts.NotificationDTO
import framework.mediator.Command
import framework.mediator.CommandHandler
import framework.mediator.Mediator
import jakarta.inject.Inject
import jakarta.inject.Provider
import java.time.Clock
import java.time.Instant

class HandleClaudeHookEvent(val event: ClaudeHookEvent) : Command<Unit>

class HandleClaudeHookEventCommandHandler @Inject constructor(
    private val repository: ClaudeSessionRepository,
    private val messagePublisher: MessagePublisher,
    // A provider, as the mediator is itself built from all request handlers, this one included.
    private val mediator: Provider<Mediator>,
) : CommandHandler<HandleClaudeHookEvent, Unit> {

    private val clock = Clock.systemUTC()

    override suspend fun handle(command: HandleClaudeHookEvent) {
        val event = command.event
        val sessionId = event.sessionId ?: return
        val now = clock.instant()

        val session = repository.update(sessionId) { existing ->
            (existing ?: ClaudeSession.startedBy(sessionId, event, now))?.apply { handle(event, now) }
        } ?: return

        if (session.isEnded) {
            messagePublisher.publish(ClaudeSessionRemovedMessageDTO(sessionId))
            return
        }

        val dto = session.toDTO()
        messagePublisher.publish(ClaudeSessionUpdatedMessageDTO(dto))

        for (sessionEvent in session.pendingEvents) {
            when (sessionEvent) {
                is ClaudeSessionEvent.TurnEnded ->
                    mediator.get().send(PostNotification(turnEndedNotification(dto, sessionEvent, now)))
            }
        }
    }

    private fun turnEndedNotification(session: ClaudeSessionDTO, event: ClaudeSessionEvent.TurnEnded, now: Instant): NotificationDTO {
        val project = session.project ?: "Claude Code"
        return NotificationDTO(
            id = "claude-${session.id}-${now.toEpochMilli()}",
            title = if (event.failed) "Claude stopped with an error in $project" else "Claude finished in $project",
            description = session.result ?: session.prompt ?: "",
            thumbnail = null,
            timestamp = now,
            source = NOTIFICATION_SOURCE,
        )
    }

    private companion object {
        const val NOTIFICATION_SOURCE = "Claude Code"
    }
}
