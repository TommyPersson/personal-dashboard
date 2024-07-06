package apps.hotkeys.application

import apps.hotkeys.application.commands.PerformHotKeyActionCommandHandler
import apps.hotkeys.application.config.HotKeysAppConfig
import apps.hotkeys.application.queries.GetHotKeysDataQueryHandler
import com.google.inject.Binder
import com.google.inject.Module
import framework.guice.bindAppConfig
import framework.guice.bindAppModule
import framework.guice.bindRequestHandler

class HotKeysGuiceModule : Module {
    override fun configure(binder: Binder) {
        binder.bindAppModule<HotKeysAppModule>()
        binder.bindAppConfig<HotKeysAppConfig>("hot-keys")
        binder.bindRequestHandler<GetHotKeysDataQueryHandler>()
        binder.bindRequestHandler<PerformHotKeyActionCommandHandler>()
    }
}