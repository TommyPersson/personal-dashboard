package common.winctrl

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import core.CoreConfig
import jakarta.inject.Inject
import jakarta.inject.Singleton
import utils.process.runProcess
import kotlin.reflect.KClass

@Singleton
class WinCtrlCommandExecutor @Inject constructor(
    private val config: CoreConfig,
    private val objectMapper: ObjectMapper,
) {

    private val executablePath = config.winCtrl.executablePath

    suspend fun <TCommandData : Any> execute(klass: KClass<TCommandData>, vararg args: String): CommandOutput<TCommandData> {
        val process = runProcess(executablePath, *args)

        val rawOutput = objectMapper.readValue<CommandOutput<Any>>(process.outputText)
        val output: CommandOutput<TCommandData> = CommandOutput(
            Code = rawOutput.Code,
            Message = rawOutput.Message,
            Data = rawOutput.Data?.let { objectMapper.convertValue(rawOutput.Data, klass.java) }
        )

        if (process.process.exitValue() != 0) {
            throw Exception(process.outputText)
        }

        return output
    }
}

inline suspend fun <reified TCommandData : Any> WinCtrlCommandExecutor.execute(vararg args: String): CommandOutput<TCommandData> {
    return execute(TCommandData::class, *args)
}

data class CommandOutput<TCommandData : Any>(
    val Code: Int,
    val Message: String,
    val Data: TCommandData?,
)
