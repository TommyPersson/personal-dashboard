package testing

import com.fasterxml.jackson.databind.JsonNode
import com.google.inject.Injector
import io.restassured.RestAssured
import io.restassured.http.ContentType
import io.restassured.specification.RequestSpecification
import org.junit.jupiter.api.BeforeEach
import utils.JSON
import java.io.File

/**
 * Base class for tests that drive the backend over HTTP and verify the files it reads and writes in `DATA_DIR`.
 * Name subclasses `*IT` so failsafe picks them up.
 */
abstract class IntegrationTest {

    protected val backend = TestBackend
    /** WireMock standing in for WinCtrl; stub and verify its endpoints in tests. */
    protected val winCtrl get() = backend.winCtrlMock

    /** The running backend's injector. Only singletons are shared with the backend; anything else is a new instance. */
    protected val injector: Injector get() = backend.injector

    protected inline fun <reified T : Any> inject(): T = injector.getInstance(T::class.java)

    @BeforeEach
    fun resetBackend() {
        RestAssured.baseURI = "http://localhost"
        RestAssured.port = backend.port
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails()
        backend.resetState()
    }

    protected fun RequestSpecification.jsonBody(body: Any): RequestSpecification =
        contentType(ContentType.JSON).body(JSON.objectMapper.writeValueAsString(body))

    protected fun dataFile(name: String) = File(backend.dataFilesDir, name)

    protected fun cacheFile(name: String) = File(backend.cacheDir, name)

    protected fun File.readJson(): JsonNode = JSON.objectMapper.readTree(this)

    protected fun File.writeJson(value: Any) {
        parentFile.mkdirs()
        JSON.objectMapper.writeValue(this, value)
    }
}
