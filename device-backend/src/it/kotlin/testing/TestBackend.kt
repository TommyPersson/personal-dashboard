package testing

import com.github.tomakehurst.wiremock.WireMockServer
import com.github.tomakehurst.wiremock.client.WireMock.*
import com.github.tomakehurst.wiremock.core.WireMockConfiguration.options
import com.google.inject.Guice
import com.google.inject.Injector
import core.defaultGuiceModules
import core.rootModule
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import kotlinx.coroutines.runBlocking
import java.io.File
import java.nio.file.Files

/**
 * A single backend instance shared by all integration tests in the JVM.
 *
 * It runs the real Ktor/Guice wiring, with every app, against a throw-away data directory. Each external service is
 * played by its own WireMock server, which the configs written by [TestConfigs] point the backend at. The data
 * directory has to be chosen before anything touches [utils.Directories], which is why everything here happens lazily
 * on first use.
 */
object TestBackend {

    /** WinCtrl, the service on the Windows PC. */
    val winCtrlMock = startWireMock()
    val githubMock = startWireMock()
    val bitbucketMock = startWireMock()
    val openWeatherMock = startWireMock()

    private val wireMocks = listOf(winCtrlMock, githubMock, bitbucketMock, openWeatherMock)

    val dataDir: File = prepareDataDir()

    val configDir = File(dataDir, "config")
    val dataFilesDir = File(dataDir, "data")
    val cacheDir = File(dataDir, "cache")

    /** The injector the running backend was created with. Accessing it starts the backend. */
    val injector: Injector by lazy { Guice.createInjector(defaultGuiceModules()) }

    val port: Int by lazy { start() }

    /**
     * Removes files written by previous tests, keeping directories (some components create them only once), and
     * resets all WireMock servers. WinCtrl is reset to accept any action while reporting no active window, media or
     * icons.
     *
     * In-memory state of the backend (e.g. the weather cache) is not reset; tests that depend on it should reset it
     * through [injector].
     */
    fun resetState() {
        listOf(dataFilesDir, cacheDir).forEach { dir ->
            dir.walkBottomUp().filter { it.isFile }.forEach { it.delete() }
        }

        wireMocks.forEach { it.resetAll() }
        winCtrlMock.stubFor(post(urlPathMatching("/api/.*/actions/.*")).willReturn(ok()))
    }

    private fun start(): Int {
        val server = embeddedServer(Netty, port = 0) {
            rootModule(injector)
        }.start(wait = false)

        Runtime.getRuntime().addShutdownHook(Thread {
            server.stop(0, 1000)
            wireMocks.forEach { it.stop() }
        })

        return runBlocking { server.engine.resolvedConnectors().first().port }
    }

    private fun startWireMock() = WireMockServer(options().dynamicPort()).also { it.start() }

    private fun prepareDataDir(): File {
        // Set by failsafe; fall back to a temp dir so tests can also be started from an IDE.
        val dir = System.getProperty("dataDir")?.let { File(it) }
            ?: Files.createTempDirectory("personal-dashboard-it").toFile()

        dir.deleteRecursively()
        System.setProperty("dataDir", dir.absolutePath)

        TestConfigs.writeTo(
            File(dir, "config"),
            TestConfigs.Urls(
                winCtrl = winCtrlMock.baseUrl(),
                github = githubMock.baseUrl(),
                bitbucket = bitbucketMock.baseUrl(),
                openWeather = openWeatherMock.baseUrl(),
            ),
        )

        return dir
    }
}
