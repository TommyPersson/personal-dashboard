package core

import io.restassured.module.kotlin.extensions.Extract
import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.Test
import testing.IntegrationTest
import testing.TestConfigs

/** The pin code and JWT secret come from `config/core.yaml` in the data directory. */
class AuthIT : IntegrationTest() {

    @Test
    fun `unlocking with the configured pin code sets a session cookie that unlocks the device`() {
        val jwt = Given {
            jsonBody(mapOf("pinCode" to TestConfigs.PIN_CODE))
        } When {
            post("/api/auth/unlock-device")
        } Then {
            statusCode(200)
            cookie("authJwt", not(emptyOrNullString()))
        } Extract {
            cookie("authJwt")
        }

        Given {
            cookie("authJwt", jwt)
        } When {
            get("/api/auth/is-device-unlocked")
        } Then {
            statusCode(200)
            body("isDeviceUnlocked", equalTo(true))
        }
    }

    @Test
    fun `unlocking with the wrong pin code is rejected`() {
        Given {
            jsonBody(mapOf("pinCode" to "0000"))
        } When {
            post("/api/auth/unlock-device")
        } Then {
            statusCode(401)
            body("errorCode", equalTo("E-CORE-InvalidPinCode"))
        }
    }

    @Test
    fun `device is locked without a valid session cookie`() {
        When {
            get("/api/auth/is-device-unlocked")
        } Then {
            statusCode(200)
            body("isDeviceUnlocked", equalTo(false))
        }

        Given {
            cookie("authJwt", "not-a-jwt")
        } When {
            get("/api/auth/is-device-unlocked")
        } Then {
            statusCode(200)
            body("isDeviceUnlocked", equalTo(false))
        }
    }
}
