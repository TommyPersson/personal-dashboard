package apps.weather

import apps.weather.application.queries.GetWeatherAppDataQueryHandler
import com.github.tomakehurst.wiremock.client.WireMock
import com.github.tomakehurst.wiremock.client.WireMock.*
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.contains
import org.hamcrest.Matchers.equalTo
import org.hamcrest.Matchers.hasSize
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import testing.IntegrationTest
import testing.TestConfigs

class WeatherIT : IntegrationTest() {

    private val openWeather get() = backend.openWeatherMock

    private val oneCallRequest get() = getRequestedFor(urlPathEqualTo("/data/3.0/onecall"))

    @BeforeEach
    fun clearWeatherCache() {
        inject<GetWeatherAppDataQueryHandler>().invalidateCaches()
    }

    @Test
    fun `weather from OpenWeather is mapped and rounded`() {
        stubOneCall()

        When {
            get("/api/apps/weather/data")
        } Then {
            statusCode(200)
            body("cityName", equalTo("Gothenburg"))
            body("currentWeather.temperature", equalTo(7.0f))
            body("currentWeather.temperatureFeelsLike", equalTo(4.0f))
            body("currentWeather.weatherIconName", equalTo("04d"))
            body("currentWeather.humidityPercent", equalTo(81.0f))
            body("hourlyForecasts", hasSize<Any>(1))
            body("hourlyForecasts[0].temperature", equalTo(6.0f))
            body("dailyForecasts.temperatureHigh", contains(9.0f))
            body("dailyForecasts.temperatureLow", contains(2.0f))
            body("dailyForecasts.weatherIconName", contains("10d"))
        }
    }

    @Test
    fun `weather is requested for the configured location and API key`() {
        stubOneCall()

        When { get("/api/apps/weather/data") } Then { statusCode(200) }

        openWeather.verify(
            1, oneCallRequest
                .withQueryParam("lat", WireMock.equalTo("57.7"))
                .withQueryParam("lon", WireMock.equalTo("11.97"))
                .withQueryParam("units", WireMock.equalTo("metric"))
                .withQueryParam("appid", WireMock.equalTo(TestConfigs.OPEN_WEATHER_API_KEY))
        )
    }

    @Test
    fun `weather is cached between requests`() {
        stubOneCall()

        repeat(3) {
            When { get("/api/apps/weather/data") } Then { statusCode(200) }
        }

        openWeather.verify(1, oneCallRequest)
    }

    @Test
    fun `OpenWeather errors are reported as server errors`() {
        openWeather.stubFor(get(urlPathEqualTo("/data/3.0/onecall")).willReturn(unauthorized()))

        When {
            get("/api/apps/weather/data")
        } Then {
            statusCode(500)
        }
    }

    private fun stubOneCall() {
        openWeather.stubFor(get(urlPathEqualTo("/data/3.0/onecall")).willReturn(okJson(ONE_CALL_RESPONSE)))
    }

    private companion object {
        val ONE_CALL_RESPONSE = """
            {
              "current": {
                "dt": 1763112600, "sunrise": 1763103600, "sunset": 1763131200,
                "temp": 6.8, "feels_like": 4.2, "pressure": 1012, "humidity": 81, "dew_point": 3.7,
                "uvi": 0.3, "clouds": 75, "visibility": 10000, "wind_speed": 4.1, "wind_deg": 230,
                "weather": [ { "id": 803, "main": "Clouds", "description": "broken clouds", "icon": "04d" } ]
              },
              "hourly": [
                {
                  "dt": 1763114400, "temp": 6.4, "feels_like": 3.9, "pressure": 1012, "humidity": 83,
                  "dew_point": 3.6, "uvi": 0.2, "clouds": 80, "visibility": 10000, "wind_speed": 4.3,
                  "wind_deg": 232, "wind_gust": 8.1,
                  "weather": [ { "id": 803, "main": "Clouds", "description": "broken clouds", "icon": "04d" } ]
                }
              ],
              "daily": [
                {
                  "dt": 1763114400, "sunrise": 1763103600, "sunset": 1763131200, "summary": "Rain later",
                  "temp": { "day": 7.1, "min": 2.3, "max": 8.6, "night": 3.0, "eve": 5.2, "morn": 2.5 },
                  "feels_like": { "day": 4.5, "night": 0.1, "eve": 2.8, "morn": -0.4 },
                  "pressure": 1010, "humidity": 85, "dew_point": 4.2, "uvi": 0.6, "clouds": 90,
                  "wind_speed": 6.2, "wind_deg": 210, "wind_gust": 12.4,
                  "weather": [ { "id": 500, "main": "Rain", "description": "light rain", "icon": "10d" } ]
                }
              ]
            }
        """.trimIndent()
    }
}
