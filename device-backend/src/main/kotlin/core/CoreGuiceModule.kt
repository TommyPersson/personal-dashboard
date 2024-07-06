package core
import com.google.inject.Binder
import common.services.ProcessService
import common.services.ProcessServiceImpl
import common.winctrl.WinCtrlCommandExecutor
import framework.config.ConfigProvider
import framework.guice.bindConfig
import framework.mediator.Mediator

class CoreGuiceModule : com.google.inject.Module {
    override fun configure(binder: Binder) {
        binder.bindConfig<CoreConfig>("core")

        binder.bind(Mediator::class.java)
        binder.bind(ConfigProvider::class.java)
        binder.bind(WinCtrlCommandExecutor::class.java)
        binder.bind(ProcessService::class.java).to(ProcessServiceImpl::class.java)
    }
}