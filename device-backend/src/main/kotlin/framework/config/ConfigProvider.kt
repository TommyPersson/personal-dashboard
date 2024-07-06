package framework.config

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import utils.Directories
import java.io.File
import kotlin.reflect.KClass

class ConfigProvider {

    private val objectMapper = ObjectMapper(YAMLFactory()).also {
        it.findAndRegisterModules()
        it.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
    }

    suspend fun <TConfig : Any> getConfig(name: String, klass: KClass<TConfig>): TConfig =
        withContext(Dispatchers.IO) {
            val configFile = getConfigFile(name)
            objectMapper.readValue(configFile, klass.java)
        }

    private fun getConfigFile(name: String) = File(Directories.Configs, "${name}.yaml")
}