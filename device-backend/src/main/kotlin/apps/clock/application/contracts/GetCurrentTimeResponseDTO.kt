package apps.clock.application.contracts

import java.time.Instant

data class GetCurrentTimeResponseDTO(
    val currentTime: Instant
)