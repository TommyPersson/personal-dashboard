package common.services

import common.winctrl.WinCtrlCommandExecutor
import common.winctrl.commands.ActiveWindowInfoCommandData
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class ProcessServiceImpl @Inject constructor(
    private val executor: WinCtrlCommandExecutor,
) : ProcessService {

    override suspend fun getActiveProcessName(): String? =
        executor.execute(ActiveWindowInfoCommandData::class, "processes", "active-window", "info").Data?.ProcessName
}
