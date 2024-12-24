package utils.process

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.withContext
import java.util.concurrent.TimeUnit

suspend fun runProcess(executable: String, vararg args: String): FinishedProcess = withContext(Dispatchers.IO) {
    val process = ProcessBuilder().command(executable, *args).start()

    val outputTextJob = async {
        val builder = StringBuilder()
        val buffer = CharArray(1024)
        process.inputReader().use {
            while (process.isAlive) {
                val size = it.read(buffer)
                builder.append(buffer.sliceArray(0..<size))
            }
        }

        builder.toString()
    }
    val hasTerminated = process.waitFor(5, TimeUnit.SECONDS)
    if (!hasTerminated) {
        process.destroy()
        throw Exception("process timed out")
    }
    val outputText = outputTextJob.await()

    FinishedProcess(
        process = process,
        outputText = outputText,
    )
}

data class FinishedProcess(
    val process: Process,
    val outputText: String
)
