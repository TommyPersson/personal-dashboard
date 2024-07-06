package apps.hotkeys.application.commands

import apps.hotkeys.domain.HotKeysModel
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject
import java.awt.Robot
import java.awt.event.KeyEvent
import java.util.UUID

data class PerformHotKeyAction(val hotKeyId: UUID) : Command<Unit>

class PerformHotKeyActionCommandHandler @Inject constructor(
    private val model: HotKeysModel
) : CommandHandler<PerformHotKeyAction, Unit> {
    override suspend fun handle(command: PerformHotKeyAction) {
        val hotKey = model.getHotKey(command.hotKeyId)
            ?: TODO("error handling")

        val robot = Robot()

        val keys = hotKey.keys.split("+")
        val modifiers = keys.dropLast(1)
        val key = keys.last()

        val modifierKeyCodes = modifiers.map { getKeyCode(it) }
        val keyCode = getKeyCode(key)

        for (modifierKeyCode in modifierKeyCodes) {
            robot.keyPress(modifierKeyCode)
            println("Robot pressed $modifierKeyCode")
        }

        robot.keyPress(keyCode)
        println("Robot pressed $keyCode")
        robot.keyRelease(keyCode)
        println("Robot released $keyCode")

        for (modifierKeyCode in modifierKeyCodes.reversed()) {
            robot.keyRelease(keyCode)
            println("Robot released $modifierKeyCode")
        }

        robot.keyRelease(KeyEvent.VK_CONTROL)
        robot.keyRelease(KeyEvent.VK_SHIFT)
        robot.keyRelease(KeyEvent.VK_ALT)
        robot.keyRelease(KeyEvent.VK_ALT_GRAPH)
    }
}

fun getKeyCode(key: String): Int {
    val uppercase = key.uppercase()
    val keyCode = when (uppercase) {
        "CTRL" -> return KeyEvent.VK_CONTROL
        else -> KeyEvent::class.java.getField("VK_${uppercase}").get(null) as Int
    }

    return keyCode
}

