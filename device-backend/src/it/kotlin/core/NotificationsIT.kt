package core

import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.Test
import testing.IntegrationTest
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class NotificationsIT : IntegrationTest() {

    private val notificationsFile get() = dataFile("notifications.json")

    @Test
    fun `posted notification is written to the data file and listed`() {
        Given {
            jsonBody(notification(id = "n-1", title = "Build failed"))
        } When {
            post("/api/notifications")
        } Then {
            statusCode(200)
            body("message", equalTo("OK"))
        }

        assertTrue(notificationsFile.exists())
        val stored = notificationsFile.readJson()["notifications"]
        assertEquals(1, stored.size())
        assertEquals("n-1", stored[0]["id"].asText())
        assertEquals("Build failed", stored[0]["title"].asText())
        assertFalse(stored[0]["isDismissed"].asBoolean())

        When {
            get("/api/notifications")
        } Then {
            statusCode(200)
            body("items.id", contains("n-1"))
            body("items[0].title", equalTo("Build failed"))
            body("items[0].source", equalTo("integration-test"))
        }
    }

    @Test
    fun `notifications are listed newest first`() {
        listOf(
            notification(id = "old", timestamp = "2026-01-01T10:00:00Z"),
            notification(id = "new", timestamp = "2026-01-02T10:00:00Z"),
        ).forEach {
            Given { jsonBody(it) } When { post("/api/notifications") } Then { statusCode(200) }
        }

        When {
            get("/api/notifications")
        } Then {
            body("items.id", contains("new", "old"))
        }
    }

    @Test
    fun `dismissed notification is marked in the data file and no longer listed`() {
        Given { jsonBody(notification(id = "n-1")) } When { post("/api/notifications") } Then { statusCode(200) }
        Given { jsonBody(notification(id = "n-2")) } When { post("/api/notifications") } Then { statusCode(200) }

        When {
            post("/api/notifications/n-1/actions/dismiss")
        } Then {
            statusCode(200)
        }

        val stored = notificationsFile.readJson()["notifications"].associateBy { it["id"].asText() }
        assertTrue(stored.getValue("n-1")["isDismissed"].asBoolean())
        assertFalse(stored.getValue("n-2")["isDismissed"].asBoolean())

        When {
            get("/api/notifications")
        } Then {
            body("items.id", contains("n-2"))
        }
    }

    @Test
    fun `notifications already in the data file are served`() {
        notificationsFile.writeJson(
            mapOf(
                "notifications" to listOf(
                    notification(id = "from-disk", title = "Persisted") + ("isDismissed" to false),
                    notification(id = "dismissed-on-disk") + ("isDismissed" to true),
                )
            )
        )

        When {
            get("/api/notifications")
        } Then {
            statusCode(200)
            body("items.id", contains("from-disk"))
            body("items[0].title", equalTo("Persisted"))
        }
    }

    @Test
    fun `no notifications when there is no data file`() {
        When {
            get("/api/notifications")
        } Then {
            statusCode(200)
            body("items", empty<Any>())
        }

        assertFalse(notificationsFile.exists())
    }

    private fun notification(
        id: String,
        title: String = "Title of $id",
        timestamp: String = "2026-11-14T12:00:00Z",
    ) = mapOf(
        "id" to id,
        "title" to title,
        "description" to "Description of $id",
        "thumbnail" to null,
        "timestamp" to timestamp,
        "source" to "integration-test",
    )
}
