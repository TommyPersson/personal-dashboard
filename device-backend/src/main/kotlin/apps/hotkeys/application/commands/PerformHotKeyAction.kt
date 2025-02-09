package apps.hotkeys.application.commands

import apps.hotkeys.domain.HotKeysModel
import common.winctrl.WinCtrlFacade
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject
import java.awt.Robot
import java.awt.event.KeyEvent
import java.util.UUID

data class PerformHotKeyAction(val hotKeyId: UUID) : Command<Unit>

class PerformHotKeyActionCommandHandler @Inject constructor(
    private val model: HotKeysModel,
    private val winCtrlFacade: WinCtrlFacade,
) : CommandHandler<PerformHotKeyAction, Unit> {
    override suspend fun handle(command: PerformHotKeyAction) {
        val hotKey = model.getHotKey(command.hotKeyId)
            ?: TODO("error handling")

        winCtrlFacade.keyboard.sendKeys(hotKey.keys)
    }
}
