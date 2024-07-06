package apps.mediacontrol.application.commands

import common.winctrl.WinCtrlCommandExecutor
import common.winctrl.execute
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject

class PauseOrPlayMedia : Command<Unit>

class PauseOrPlayMediaCommandHandler @Inject constructor(
    private val executor: WinCtrlCommandExecutor,
) : CommandHandler<PauseOrPlayMedia, Unit> {
    override suspend fun handle(command: PauseOrPlayMedia) {
        executor.execute<Any>("system-media", "pause-or-play")
    }
}