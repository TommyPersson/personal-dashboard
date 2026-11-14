package apps.mediacontrol

import com.github.tomakehurst.wiremock.client.WireMock.*
import io.restassured.module.kotlin.extensions.Extract
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.equalTo
import org.hamcrest.Matchers.nullValue
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import testing.IntegrationTest
import kotlin.test.assertContentEquals

class MediaControlIT : IntegrationTest() {

    @Test
    fun `status of the playing media is read from WinCtrl`() {
        winCtrl.stubFor(
            get("/api/system-media/status").willReturn(
                okJson(
                    """
                    {
                      "PlaybackInfo": {
                        "Controls": {
                          "IsPlayEnabled": false, "IsPauseEnabled": true, "IsPlayPauseToggleEnabled": true,
                          "IsNextEnabled": true, "IsPreviousEnabled": false
                        },
                        "PlaybackStatus": "Playing"
                      },
                      "MediaProperties": { "Artist": "The Band", "Title": "The Song" }
                    }
                    """
                )
            )
        )

        When {
            get("/api/apps/media-control/status")
        } Then {
            statusCode(200)
            body("status.state", equalTo("Playing"))
            body("status.mediaInfo.artist", equalTo("The Band"))
            body("status.mediaInfo.title", equalTo("The Song"))
            body("status.controls.isPlayEnabled", equalTo(false))
            body("status.controls.isPauseEnabled", equalTo(true))
            body("status.controls.isPauseOrPlayEnabled", equalTo(true))
            body("status.controls.isSkipNextEnabled", equalTo(true))
            body("status.controls.isSkipPreviousEnabled", equalTo(false))
        }
    }

    @Test
    fun `no status when WinCtrl reports no media`() {
        When {
            get("/api/apps/media-control/status")
        } Then {
            statusCode(200)
            body("status", nullValue())
        }
    }

    @Test
    fun `thumbnail is served from WinCtrl`() {
        val thumbnail = byteArrayOf(5, 6, 7)
        winCtrl.stubFor(get("/api/system-media/thumbnail").willReturn(ok().withBody(thumbnail)))

        val served = When {
            get("/api/apps/media-control/thumbnail")
        } Then {
            statusCode(200)
            contentType("image/png")
        } Extract {
            body().asByteArray()
        }

        assertContentEquals(thumbnail, served)
    }

    @Test
    fun `no thumbnail when WinCtrl has none`() {
        When {
            get("/api/apps/media-control/thumbnail")
        } Then {
            statusCode(404)
        }
    }

    @ParameterizedTest
    @CsvSource(
        "pause-or-play, pause-or-resume",
        "skip-next, skip-next",
        "skip-previous, skip-previous",
    )
    fun `media actions are sent to WinCtrl`(action: String, winCtrlAction: String) {
        When {
            post("/api/apps/media-control/actions/$action")
        } Then {
            statusCode(200)
        }

        winCtrl.verify(1, postRequestedFor(urlEqualTo("/api/system-media/actions/$winCtrlAction")))
    }
}
