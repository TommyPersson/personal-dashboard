package apps.clock

import io.restassured.module.kotlin.extensions.Extract
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.junit.jupiter.api.Test
import testing.IntegrationTest
import java.time.Duration
import java.time.Instant
import kotlin.test.assertTrue

class ClockIT : IntegrationTest() {

    @Test
    fun `current time is the server time`() {
        val before = Instant.now()

        val currentTime = When {
            get("/api/apps/clock/current-time")
        } Then {
            statusCode(200)
        } Extract {
            Instant.parse(path<String>("currentTime"))
        }

        val after = Instant.now()
        assertTrue(currentTime >= before.minus(Duration.ofSeconds(1)) && currentTime <= after, "$currentTime")
    }
}
