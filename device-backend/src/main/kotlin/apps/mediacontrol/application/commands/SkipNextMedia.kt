package apps.mediacontrol.application.commands

import common.winctrl.WinCtrlFacade
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject

class SkipNextMedia : Command<Unit>

class SkipNextMediaCommandHandler @Inject constructor(
    private val winCtrl: WinCtrlFacade,
) : CommandHandler<SkipNextMedia, Unit> {
    override suspend fun handle(command: SkipNextMedia) {
        winCtrl.mediaControl.skipNext()
    }
}