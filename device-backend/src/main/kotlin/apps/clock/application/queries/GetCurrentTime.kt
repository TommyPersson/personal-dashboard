package apps.clock.application.queries

import apps.clock.application.contracts.GetCurrentTimeResponseDTO
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject
import java.time.Instant

class GetCurrentTime : Query<GetCurrentTimeResponseDTO> {
}

class GetCurrentTimeQueryHandler @Inject constructor() : QueryHandler<GetCurrentTime, GetCurrentTimeResponseDTO> {
    override suspend fun handle(query: GetCurrentTime): GetCurrentTimeResponseDTO {
        return GetCurrentTimeResponseDTO(Instant.now())
    }
}

