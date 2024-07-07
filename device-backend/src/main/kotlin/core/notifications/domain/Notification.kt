package core.notifications.domain

import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import java.time.Instant

@JsonAutoDetect(setterVisibility = JsonAutoDetect.Visibility.ANY)
class Notification(
    val id: String,
    val title: String,
    val description: String,
    val thumbnail: ByteArray?,
    val timestamp: Instant,
    val source: String
) {
    @JsonProperty("isDismissed")
    private var _isDismissed: Boolean = false

    val isDismissed: Boolean @JsonIgnore get() = _isDismissed

    fun dismiss() {
        _isDismissed = true
    }
}