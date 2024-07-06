package apps.weather.infrastructure.openweathermap

import apps.weather.application.config.WeatherAppConfig
import apps.weather.domain.Location
import apps.weather.infrastructure.openweathermap.contracts.OneCallResponseDTO
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import kotlinx.coroutines.future.await
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse.BodyHandlers

class OpenWeatherMapApiClient(
    private val config: WeatherAppConfig.Source.OpenWeather,
) {

    private val objectMapper = jacksonObjectMapper().also {
        it.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
    }

    private val oneCallApiUriFormat =
        "https://api.openweathermap.org/data/3.0/onecall?lat=%s&lon=%s&units=metric&appid=${config.apiKey}"

    private val httpClient: HttpClient = HttpClient.newHttpClient()

    suspend fun oneCall(location: Location): OneCallResponseDTO {
        return makeRequest(makeApiUri(location, oneCallApiUriFormat))
    }

    private suspend inline fun <reified TResponse> makeRequest(url: URI): TResponse {
        val request = HttpRequest.newBuilder().GET().uri(url).build()
        val response = httpClient.sendAsync(request, BodyHandlers.ofString()).await()
        return if (response.statusCode() >= 200 && response.statusCode() < 300) {
            objectMapper.readValue<TResponse>(response.body())
        } else {
            println(response)
            error("uh oh")
        }
    }

    private fun makeApiUri(location: Location, format: String): URI {
        return URI.create(String.format(format, location.latitude.toString(), location.longitude.toString()))
    }
}