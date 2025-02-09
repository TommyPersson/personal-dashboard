package common.services

import common.winctrl.WinCtrlFacade
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class ProcessServiceImpl @Inject constructor(
    private val winCtrl: WinCtrlFacade,
) : ProcessService {

    override suspend fun getActiveProcessName(): String? {
        val info = winCtrl.processes.getActiveWindowInfo()

        return info?.ProcessName
    }
}
