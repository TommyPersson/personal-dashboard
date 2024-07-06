package apps.weather.application.config

import apps.weather.domain.Location
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.annotation.JsonTypeName

data class WeatherAppConfig(
    val source: Source,
    val location: Location,
) {
    @JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type",
    )
    sealed class Source {
        @JsonTypeName("OpenWeather")
        class OpenWeather(
            val apiKey: String,
        ) : Source()
    }
}