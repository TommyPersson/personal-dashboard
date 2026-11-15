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
        val desktopSessionId = repository.get(command.sessionId)?.desktopSessionId ?: return false

        winCtrlFacade.processes.openUrl("claude://code/continue?session=$desktopSessionId")
        // When the app is running behind other windows, Windows' foreground lock stops it from coming to the front
        // by itself (its taskbar button just flashes), so WinCtrl has to do it.
        winCtrlFacade.processes.focusWindow("claude")
        return true
    }
}
