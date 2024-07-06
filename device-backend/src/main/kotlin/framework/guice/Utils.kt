
package framework.guice

import framework.AppModule
import com.google.inject.Binder
import com.google.inject.multibindings.Multibinder
import framework.config.ConfiguredConfigProvider
import framework.mediator.RequestHandlerMarker

inline fun <reified THandler : RequestHandlerMarker> Binder.bindRequestHandler() {
    val multiBinder = Multibinder.newSetBinder(this, RequestHandlerMarker::class.java)
    multiBinder.addBinding().to(THandler::class.java)
}


inline fun <reified TModule : AppModule> Binder.bindAppModule() {
    val multiBinder = Multibinder.newSetBinder(this, AppModule::class.java)
    multiBinder.addBinding().to(TModule::class.java)
}

inline fun <reified TConfig : Any> Binder.bindConfig(name: String) {
    bind(TConfig::class.java)
        .toProvider(ConfiguredConfigProvider.of(name, TConfig::class))
}

inline fun <reified TConfig : Any> Binder.bindAppConfig(appName: String) {
    bind(TConfig::class.java)
        .toProvider(ConfiguredConfigProvider.ofApp(appName, TConfig::class))
}