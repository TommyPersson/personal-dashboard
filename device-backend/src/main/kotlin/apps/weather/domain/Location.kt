package apps.weather.domain

data class Location(
    val name: String,
    val latitude: Double,
    val longitude: Double,
)

object Locations {
    object SE {
        val Linkoping = Location(
            name = "Linköping",
            latitude = 58.4098135,
            longitude = 15.6245252,
        )
    }
}