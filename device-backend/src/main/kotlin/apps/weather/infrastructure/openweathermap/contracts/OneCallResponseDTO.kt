package apps.weather.infrastructure.openweathermap.contracts

data class OneCallResponseDTO(
    val current: Current,
    val hourly: List<Hourly>,
    val daily: List<Daily>,
) {
    data class Current(
        val dt: Long,
        val sunrise: Long,
        val sunset: Long,
        val temp: Double,
        val feels_like: Double,
        val pressure: Double,
        val humidity: Double,
        val dew_point: Double,
        val uvi: Double,
        val clouds: Double,
        val visibility: Double,
        val wind_speed: Double,
        val wind_deg: Double,
        val weather: List<Weather>,
    )

    data class Hourly(
        val dt: Long,
        val temp: Double,
        val feels_like: Double,
        val pressure: Double,
        val humidity: Double,
        val dew_point: Double,
        val uvi: Double,
        val clouds: Double,
        val visibility: Double,
        val wind_speed: Double,
        val wind_deg: Double,
        val wind_gust: Double,
        val weather: List<Weather>,
    )

    data class Daily(
        val dt: Long,
        val sunrise: Long,
        val sunset: Long,
        val summary: String,
        val temp: Temp,
        val feels_like: FeelsLike,
        val pressure: Double,
        val humidity: Double,
        val dew_point: Double,
        val uvi: Double,
        val clouds: Double,
        val wind_speed: Double,
        val wind_deg: Double,
        val wind_gust: Double,
        val weather: List<Weather>,
    ) {
        data class Temp(
            val day: Double,
            val min: Double,
            val max: Double,
            val night: Double,
            val eve: Double,
            val morn: Double,
        )
        data class FeelsLike(
            val day: Double,
            val night: Double,
            val eve: Double,
            val morn: Double,
        )
    }

    data class Weather(
        val id: Int,
        val main: String,
        val description: String,
        val icon: String,
    )
}