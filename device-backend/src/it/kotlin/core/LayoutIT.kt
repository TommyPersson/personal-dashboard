package core

import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.contains
import org.junit.jupiter.api.Test
import testing.IntegrationTest

class LayoutIT : IntegrationTest() {

    @Test
    fun `layout is read from the core config`() {
        When {
            get("/api/layout")
        } Then {
            statusCode(200)
            body("apps.appId", contains("hot-keys-app", "run-deck-app"))
        }
    }
}
