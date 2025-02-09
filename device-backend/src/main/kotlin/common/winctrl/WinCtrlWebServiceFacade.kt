package common.winctrl

import common.winctrl.commands.ActiveWindowInfoCommandData
import common.winctrl.commands.StatusCommandData
import core.CoreConfig
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.jackson.*
import jakarta.inject.Inject
import jakarta.inject.Singleton
import utils.configureJackson

@Singleton
class WinCtrlWebServiceFacade @Inject constructor(
    private val config: CoreConfig,

    ) : WinCtrlFacade {
    val winCtrlClient = HttpClient(CIO) {
        defaultRequest {
            url(config.winCtrl.url)
        }
        install(ContentNegotiation) {
            jackson {
                configureJackson(this)
            }
        }
    }

    override val mediaControl = object : WinCtrlFacade.MediaControl {
        override suspend fun pauseOrResume() {
            winCtrlClient.post("/api/system-media/actions/pause-or-resume")
        }

        override suspend fun skipPrevious() {
            winCtrlClient.post("/api/system-media/actions/skip-previous")
        }

        override suspend fun skipNext() {
            winCtrlClient.post("/api/system-media/actions/skip-next")
        }

        override suspend fun getStatus(): StatusCommandData? {
            val response = winCtrlClient.get("/api/system-media/status")
            if (response.status == HttpStatusCode.NotFound) {
                return null
            }

            return response.body<StatusCommandData>()
        }

        override suspend fun getThumbnailBytes(): ByteArray? {
            val response = winCtrlClient.get("/api/system-media/thumbnail")
            if (response.status == HttpStatusCode.NotFound) {
                return null
            }

            return response.readBytes()
        }
    }

    override val executables = object : WinCtrlFacade.Executables {
        override suspend fun getIconImageBytes(filePath: String): ByteArray {
            val response = winCtrlClient.get("/api/executables/icon-image") {
                parameter("filePath", filePath)
            }

            if (response.status != HttpStatusCode.OK) {
                return byteArrayOf()
            }

            return response.readBytes()
        }
    }

    override val processes = object : WinCtrlFacade.Processes {
        override suspend fun getActiveWindowInfo(): ActiveWindowInfoCommandData? {
            val response = winCtrlClient.get("/api/processes/active-window-info")
            if (response.status == HttpStatusCode.NotFound) {
                return null
            }

            return response.body<ActiveWindowInfoCommandData>()
        }
    }

    override val keyboard = object : WinCtrlFacade.Keyboard {
        override suspend fun sendKeys(keys: String) {
            winCtrlClient.post("/api/keyboard/actions/send-keys") {
                setBody(keys)
            }
        }
    }
}