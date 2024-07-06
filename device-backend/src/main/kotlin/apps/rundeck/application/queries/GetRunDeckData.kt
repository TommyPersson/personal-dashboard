package apps.rundeck.application.queries

import apps.rundeck.application.contracts.RunDeckDataDTO
import apps.rundeck.domain.RunDeckModel
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject

class GetRunDeckData : Query<RunDeckDataDTO>

class GetRunDeckDataQueryHandler @Inject constructor(
    private val model: RunDeckModel
) : QueryHandler<GetRunDeckData, RunDeckDataDTO> {
    override suspend fun handle(query: GetRunDeckData): RunDeckDataDTO {
        return model.getData()
    }
}

