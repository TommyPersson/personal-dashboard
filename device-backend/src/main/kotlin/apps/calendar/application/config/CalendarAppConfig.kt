package apps.calendar.application.config

import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.annotation.JsonTypeName
import java.time.Duration

data class CalendarAppConfig(
    val refreshPeriod: Duration,
    val calendarProviders: List<CalendarProvider>
) {
    @JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type",
    )
    sealed class CalendarProvider {
        @JsonTypeName("google")
        data class Google(
            val emailAddress: String,
            val calendars: List<String>,
            val clientSecretJsonFilePath: String,
        ) : CalendarProvider()
    }
}
