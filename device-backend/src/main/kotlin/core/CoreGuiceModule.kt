package core

import com.fasterxml.jackson.databind.ObjectMapper
import com.google.inject.Binder
import common.services.*
import common.winctrl.WinCtrlFacade
import common.winctrl.WinCtrlWebServiceFacade
import core.auth.application.commands.UnlockDeviceCommandHandler
import core.auth.application.queries.IsDeviceUnlockedQueryHandler
import core.layout.application.queries.GetLayoutQueryHandler
import core.notifications.application.commands.DismissNotificationCommandHandler
import core.notifications.application.commands.PostNotificationCommandHandler
import core.notifications.application.queries.GetNotificationsQueryHandler
import core.notifications.domain.NotificationRepository
import core.notifications.infrastructure.NotificationRepositoryImpl
import framework.config.ConfigProvider
import framework.guice.bindAppModule
import framework.guice.bindConfig
import framework.guice.bindRequestHandler
import framework.mediator.Mediator
import utils.JSON

class CoreGuiceModule : com.google.inject.Module {
    override fun configure(binder: Binder) {
        binder.bindConfig<CoreConfig>("core")
        binder.bindAppModule<CoreAppModule>()

        binder.bind(Mediator::class.java)
        binder.bind(ConfigProvider::class.java)
        binder.bind(WinCtrlFacade::class.java).to(WinCtrlWebServiceFacade::class.java)
        binder.bind(ObjectMapper::class.java).toInstance(JSON.objectMapper)

        binder.bind(ProcessService::class.java).to(ProcessServiceImpl::class.java)
        binder.bind(NotificationRepository::class.java).to(NotificationRepositoryImpl::class.java)
        binder.bind(WebSocketService::class.java).to(WebSocketServiceImpl::class.java)
        binder.bind(MessagePublisher::class.java).to(WebSocketServiceImpl::class.java)

        binder.bindRequestHandler<GetNotificationsQueryHandler>()
        binder.bindRequestHandler<PostNotificationCommandHandler>()
        binder.bindRequestHandler<DismissNotificationCommandHandler>()

        binder.bindRequestHandler<GetLayoutQueryHandler>()

        binder.bindRequestHandler<UnlockDeviceCommandHandler>()
        binder.bindRequestHandler<IsDeviceUnlockedQueryHandler>()
    }
}