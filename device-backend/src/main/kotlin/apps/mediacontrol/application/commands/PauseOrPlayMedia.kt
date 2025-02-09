package apps.mediacontrol.application.commands

import common.winctrl.WinCtrlFacade
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject

class PauseOrPlayMedia : Command<Unit>

class PauseOrPlayMediaCommandHandler @Inject constructor(
    private val winCtrl: WinCtrlFacade,
) : CommandHandler<PauseOrPlayMedia, Unit> {
    override suspend fun handle(command: PauseOrPlayMedia) {
        winCtrl.mediaControl.pauseOrResume()
    }
}

