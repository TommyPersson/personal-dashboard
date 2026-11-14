package testing

import java.io.File

/** The YAML configs the [TestBackend] starts with, written to `DATA_DIR/config` like a real installation. */
object TestConfigs {

    const val PIN_CODE = "1234"
    const val GITHUB_ACCESS_TOKEN = "github-test-token"
    const val BITBUCKET_USERNAME = "jdoe"
    const val BITBUCKET_ACCESS_TOKEN = "bitbucket-test-token"
    const val OPEN_WEATHER_API_KEY = "open-weather-test-key"

    /** Base URLs of the (mocked) external services. */
    data class Urls(
        val winCtrl: String,
        val github: String,
        val bitbucket: String,
        val openWeather: String,
    )

    fun writeTo(configDir: File, urls: Urls) {
        File(configDir, "apps").mkdirs()

        File(configDir, "core.yaml").writeText(
            """
            auth:
              pinCode: "$PIN_CODE"
              jwtSecret: integration-test-secret
              sessionTimeoutMinutes: 60
            winCtrl:
              url: ${urls.winCtrl}
            layout:
              apps:
                - appId: hot-keys-app
                - appId: run-deck-app
            """.trimIndent()
        )

        File(configDir, "apps/hot-keys.yaml").writeText(
            """
            sections:
              - name: IntelliJ
                processNameMatches: idea64
                hotKeys:
                  - name: Run
                    keys: Shift+F10
              - name: Global
                hotKeys:
                  - name: Exit app
                    keys: Alt+F4
            """.trimIndent()
        )

        File(configDir, "apps/run-deck.yaml").writeText(
            """
            sections:
              - name: Tools
                rows:
                  - items:
                      - text: Notepad
                        type: RunExecutable
                        executable: C:\Windows\notepad.exe
                      - text: Docs
                        type: OpenUrl
                        url: https://example.com
            """.trimIndent()
        )

        File(configDir, "apps/github.yaml").writeText(
            """
            github:
              accessToken: $GITHUB_ACCESS_TOKEN
              apiUrl: ${urls.github}
            """.trimIndent()
        )

        File(configDir, "apps/bitbucket.yaml").writeText(
            """
            bitbucketServer:
              baseUrl: ${urls.bitbucket}
              authentication:
                username: $BITBUCKET_USERNAME
                accessToken: $BITBUCKET_ACCESS_TOKEN
            """.trimIndent()
        )

        File(configDir, "apps/weather.yaml").writeText(
            """
            source:
              type: OpenWeather
              apiKey: $OPEN_WEATHER_API_KEY
              apiUrl: ${urls.openWeather}
            location:
              name: Gothenburg
              latitude: 57.7
              longitude: 11.97
            """.trimIndent()
        )

        File(configDir, "apps/calendar.yaml").writeText(
            """
            refreshPeriod: PT5M
            calendarProviders:
              - type: google
                emailAddress: someone@example.com
                calendars:
                  - primary
                clientSecretJsonFilePath: does-not-exist.json
            """.trimIndent()
        )
    }
}
