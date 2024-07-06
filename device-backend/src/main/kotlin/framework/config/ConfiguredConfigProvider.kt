package framework.config

import com.google.inject.Provider
import jakarta.inject.Inject
import kotlinx.coroutines.runBlocking
import kotlin.reflect.KClass

class ConfiguredConfigProvider<TConfig : Any> private constructor(
    val name: String,
    val klass: KClass<out TConfig>
) : Provider<TConfig> {

    @Inject
    lateinit var configProvider: ConfigProvider

    override fun get(): TConfig = runBlocking {
        configProvider.getConfig(name, klass)
    }

    companion object {
        fun <TConfig : Any> ofApp(appName: String, klass: KClass<out TConfig>): ConfiguredConfigProvider<TConfig> {
            return of("apps/$appName", klass)
        }

        fun <TConfig : Any> of(appName: String, klass: KClass<out TConfig>): ConfiguredConfigProvider<TConfig> {
            return ConfiguredConfigProvider(name = appName, klass = klass)
        }
    }
}