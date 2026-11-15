package apps.claude.application.commands

import apps.claude.domain.ClaudeSessionRepository
import common.winctrl.WinCtrlFacade
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject

/**
 * Opens a session in the Claude desktop app on the workstation, through its `claude://` link handler.
 * Returns `false` if there is no such session, or the desktop app doesn't run it.
 */
class OpenClaudeSession(val sessionId: String) : Command<Boolean>

class OpenClaudeSessionCommandHandler @Inject constructor(
    private val repository: ClaudeSessionRepository,
    private val winCtrlFacade: WinCtrlFacade,
) : CommandHandler<OpenClaudeSession, Boolean> {

    override suspend fun handle(command: OpenClaudeSession): Boolean {
        val desktopSessionId = repository.getAll().find { it.id == command.sessionId }?.desktopSessionId
            ?: return false

        winCtrlFacade.processes.openUrl("claude://code/continue?session=$desktopSessionId")
        return true
    }
}
