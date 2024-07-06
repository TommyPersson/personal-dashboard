package apps.mediacontrol.application.commands

import common.winctrl.WinCtrlCommandExecutor
import common.winctrl.execute
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject

class SkipPreviousMedia : Command<Unit>

class SkipPreviousMediaCommandHandler @Inject constructor(
    private val executor: WinCtrlCommandExecutor,
) : CommandHandler<SkipPreviousMedia, Unit> {
    override suspend fun handle(command: SkipPreviousMedia) {
        executor.execute<Any>("system-media", "skip-previous")
    }
}