package core.layout.application.queries

import core.CoreConfig
import core.layout.application.contracts.GetLayoutResponseDTO
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject

class GetLayout : Query<GetLayoutResponseDTO>

class GetLayoutQueryHandler @Inject constructor(
    private val config: CoreConfig,
): QueryHandler<GetLayout, GetLayoutResponseDTO> {

    override suspend fun handle(query: GetLayout): GetLayoutResponseDTO {
        return GetLayoutResponseDTO(
            apps = config.layout.apps.map { GetLayoutResponseDTO.App(appId = it.appId) }
        )
    }
}