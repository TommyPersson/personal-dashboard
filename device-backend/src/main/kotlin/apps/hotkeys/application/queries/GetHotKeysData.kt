package apps.hotkeys.application.queries

import apps.hotkeys.application.contracts.HotKeysDataDTO
import apps.hotkeys.domain.HotKeysModel
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject

class GetHotKeysData : Query<HotKeysDataDTO>

class GetHotKeysDataQueryHandler @Inject constructor(
    private val model: HotKeysModel
) : QueryHandler<GetHotKeysData, HotKeysDataDTO> {
    override suspend fun handle(query: GetHotKeysData): HotKeysDataDTO {
        return model.getData()
    }
}