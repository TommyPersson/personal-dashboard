package apps.mediacontrol.application.commands

import common.winctrl.WinCtrlCommandExecutor
import common.winctrl.execute
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject

class SkipNextMedia : Command<Unit>

class SkipNextMediaCommandHandler @Inject constructor(
    private val executor: WinCtrlCommandExecutor,
) : CommandHandler<SkipNextMedia, Unit> {
    override suspend fun handle(command: SkipNextMedia) {
        executor.execute<Any>("system-media", "skip-next")
    }
}