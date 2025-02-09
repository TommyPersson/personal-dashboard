package apps.rundeck.application.commands

import apps.rundeck.application.contracts.RunDeckDataDTO
import apps.rundeck.domain.RunDeckModel
import common.winctrl.WinCtrlFacade
import framework.mediator.Command
import framework.mediator.CommandHandler
import jakarta.inject.Inject
import java.net.URI
import java.util.*

class RunItemAction(val itemId: UUID) : Command<Unit>

class RunItemActionCommandHandler @Inject constructor(
    private val model: RunDeckModel,
    private val winCtrlFacade: WinCtrlFacade
) : CommandHandler<RunItemAction, Unit> {
    override suspend fun handle(command: RunItemAction): Unit {
        val item = model.getItem(command.itemId)
            ?: TODO("error handling")

        when (item) {
            is RunDeckDataDTO.Item.OpenUrl -> {
                winCtrlFacade.processes.openUrl(item.url)
            }

            is RunDeckDataDTO.Item.RunExecutable -> {
                winCtrlFacade.processes.startProcess(item.executable)
            }
        }
    }
}


