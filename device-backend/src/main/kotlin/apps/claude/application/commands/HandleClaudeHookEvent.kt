package apps.claude.application.commands

import apps.claude.application.contracts.ClaudeSessionDTO
import apps.claude.application.contracts.messages.ClaudeSessionRemovedMessageDTO
import apps.claude.application.contracts.messages.ClaudeSessionUpdatedMessageDTO
import apps.claude.application.contracts.toDTO
import apps.claude.domain.ClaudeHookEvent
import apps.claude.domain.ClaudeSession
import apps.claude.domain.ClaudeSessionRepository
import apps.claude.domain.ClaudeSessionStatus
import apps.claude.domain.apply
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

        if (event.isSessionEnd) {
            if (repository.remove(sessionId)) {
                messagePublisher.publish(ClaudeSessionRemovedMessageDTO(sessionId))
            }
            return
        }

        val now = clock.instant()
        var previousStatus: ClaudeSessionStatus? = null
        val session = repository.update(sessionId) { existing ->
            previousStatus = existing?.status
            (existing ?: ClaudeSession.new(sessionId, event.cwd, now)).apply(event, now)
        }

        val dto = session.toDTO()
        messagePublisher.publish(ClaudeSessionUpdatedMessageDTO(dto))

        // Only a turn seen in progress has finished: not a repeated `Stop` on an idle session, nor one from a
        // session first seen through it (e.g. after a backend restart), which has no prompt or result to show.
        if (event.isTurnEnd && previousStatus in setOf(ClaudeSessionStatus.Working, ClaudeSessionStatus.WaitingForInput)) {
            mediator.get().send(PostNotification(turnEndedNotification(dto, event, now)))
        }
    }

    private fun turnEndedNotification(session: ClaudeSessionDTO, event: ClaudeHookEvent, now: Instant): NotificationDTO {
        val project = session.project ?: "Claude Code"
        return NotificationDTO(
            id = "claude-${session.id}-${now.toEpochMilli()}",
            title = if (event.isTurnFailure) "Claude stopped with an error in $project" else "Claude finished in $project",
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
