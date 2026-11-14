package apps.calendar

import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.empty
import org.junit.jupiter.api.Test
import testing.IntegrationTest

/**
 * Syncing with Google Calendar is currently disabled (`AggregateCalendarState.refresh`) until sign-in is ported from
 * the tray icon, so there is no Google API traffic to mock yet. This only covers the endpoint itself.
 */
class CalendarIT : IntegrationTest() {

    @Test
    fun `no events before the calendar has been synced`() {
        When {
            get("/api/apps/calendar/events")
        } Then {
            statusCode(200)
            body("events", empty<Any>())
        }
    }
}
