package apps.mediacontrol.application.commands

import common.winctrl.WinCtrlFacade
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject

class SkipPreviousMedia : Command<Unit>

class SkipPreviousMediaCommandHandler @Inject constructor(
    private val winCtrl: WinCtrlFacade,
) : CommandHandler<SkipPreviousMedia, Unit> {
    override suspend fun handle(command: SkipPreviousMedia) {
        winCtrl.mediaControl.skipPrevious()
    }
}