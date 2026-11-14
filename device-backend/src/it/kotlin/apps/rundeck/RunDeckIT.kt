package apps.rundeck

import com.github.tomakehurst.wiremock.client.WireMock.*
import io.restassured.module.kotlin.extensions.Extract
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.contains
import org.junit.jupiter.api.Test
import testing.IntegrationTest
import java.net.URLEncoder
import kotlin.test.assertContentEquals
import kotlin.test.assertTrue

/** Items come from `config/apps/run-deck.yaml`; icons are cached under `cache/icons`. */
class RunDeckIT : IntegrationTest() {

    private val executable = """C:\Windows\notepad.exe"""

    private val iconCacheFile
        get() = cacheFile("icons/" + URLEncoder.encode("file-$executable.png", "UTF-8"))

    private val iconRequest
        get() = getRequestedFor(urlPathEqualTo("/api/executables/icon-image"))
            .withQueryParam("filePath", equalTo(executable))

    @Test
    fun `items are read from the config`() {
        When {
            get("/api/apps/run-deck/data")
        } Then {
            statusCode(200)
            body("sections.name", contains("Tools"))
            body("sections[0].rows[0].items.text", contains("Notepad", "Docs"))
            body("sections[0].rows[0].items.type", contains("RunExecutable", "OpenUrl"))
        }
    }

    @Test
    fun `executable icon is fetched from WinCtrl once and then served from the file cache`() {
        val iconBytes = byteArrayOf(1, 2, 3, 4)
        winCtrl.stubFor(
            get(urlPathEqualTo("/api/executables/icon-image"))
                .willReturn(ok().withHeader("Content-Type", "image/png").withBody(iconBytes))
        )
        val itemId = itemId("Notepad")

        repeat(2) {
            val served = When {
                get("/api/apps/run-deck/items/$itemId/icon")
            } Then {
                statusCode(200)
                contentType("image/png")
            } Extract {
                body().asByteArray()
            }
            assertContentEquals(iconBytes, served)
        }

        winCtrl.verify(1, iconRequest)
        assertTrue(iconCacheFile.exists())
        assertContentEquals(iconBytes, iconCacheFile.readBytes())
    }

    @Test
    fun `icon already in the file cache is served without asking WinCtrl`() {
        val cachedBytes = byteArrayOf(9, 8, 7)
        iconCacheFile.parentFile.mkdirs()
        iconCacheFile.writeBytes(cachedBytes)

        val served = When {
            get("/api/apps/run-deck/items/${itemId("Notepad")}/icon")
        } Then {
            statusCode(200)
        } Extract {
            body().asByteArray()
        }

        assertContentEquals(cachedBytes, served)
        winCtrl.verify(0, iconRequest)
    }

    @Test
    fun `running items is delegated to WinCtrl`() {
        When { post("/api/apps/run-deck/items/${itemId("Notepad")}/actions/run") } Then { statusCode(200) }
        When { post("/api/apps/run-deck/items/${itemId("Docs")}/actions/run") } Then { statusCode(200) }

        winCtrl.verify(
            1, postRequestedFor(urlEqualTo("/api/processes/actions/start-process"))
                .withRequestBody(equalTo(executable))
        )
        winCtrl.verify(
            1, postRequestedFor(urlEqualTo("/api/processes/actions/open-url"))
                .withRequestBody(equalTo("https://example.com"))
        )
    }

    private fun itemId(text: String): String = When {
        get("/api/apps/run-deck/data")
    } Extract {
        path("sections.rows.flatten().items.flatten().find { it.text == '$text' }.id")
    }
}
