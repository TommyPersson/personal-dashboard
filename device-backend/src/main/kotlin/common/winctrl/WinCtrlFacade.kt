package common.winctrl

import common.winctrl.commands.ActiveWindowInfoCommandData
import common.winctrl.commands.StatusCommandData

interface WinCtrlFacade {
    interface MediaControl {
        suspend fun pauseOrResume()
        suspend fun skipPrevious()
        suspend fun skipNext()
        suspend fun getStatus(): StatusCommandData?
        suspend fun getThumbnailBytes(): ByteArray?
    }

    interface Executables {
        suspend fun getIconImageBytes(filePath: String): ByteArray
    }

    interface Processes {
        suspend fun getActiveWindowInfo(): ActiveWindowInfoCommandData?
    }

    val mediaControl: MediaControl
    val executables: Executables
    val processes: Processes
}