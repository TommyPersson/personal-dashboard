package apps.hotkeys

import com.github.tomakehurst.wiremock.client.WireMock.*
import io.restassured.module.kotlin.extensions.Extract
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.contains
import org.junit.jupiter.api.Test
import testing.IntegrationTest

/** Hot keys come from `config/apps/hot-keys.yaml` in the data directory. */
class HotKeysIT : IntegrationTest() {

    @Test
    fun `sections matching the active process are listed along with global ones`() {
        stubActiveProcess("idea64")

        When {
            get("/api/apps/hot-keys/data")
        } Then {
            statusCode(200)
            body("sections.name", contains("IntelliJ", "Global"))
            body("sections[0].hotKeys.name", contains("Run"))
        }
    }

    @Test
    fun `only global sections are listed for other processes`() {
        stubActiveProcess("notepad")

        When {
            get("/api/apps/hot-keys/data")
        } Then {
            statusCode(200)
            body("sections.name", contains("Global"))
        }
    }

    @Test
    fun `only global sections are listed when WinCtrl reports no active window`() {
        When {
            get("/api/apps/hot-keys/data")
        } Then {
            statusCode(200)
            body("sections.name", contains("Global"))
        }
    }

    @Test
    fun `performing a hot key sends its keys to WinCtrl`() {
        val hotKeyId = When {
            get("/api/apps/hot-keys/data")
        } Extract {
            path<String>("sections.find { it.name == 'Global' }.hotKeys[0].id")
        }

        When {
            post("/api/apps/hot-keys/$hotKeyId/actions/perform")
        } Then {
            statusCode(200)
        }

        winCtrl.verify(
            1, postRequestedFor(urlEqualTo("/api/keyboard/actions/send-keys"))
                .withRequestBody(equalTo("Alt+F4"))
        )
    }

    private fun stubActiveProcess(processName: String) {
        winCtrl.stubFor(
            get("/api/processes/active-window-info")
                .willReturn(okJson("""{ "ProcessId": 1, "ProcessName": "$processName" }"""))
        )
    }
}
