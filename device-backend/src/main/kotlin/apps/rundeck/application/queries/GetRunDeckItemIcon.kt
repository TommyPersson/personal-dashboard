package apps.rundeck.application.queries

import apps.rundeck.application.contracts.RunDeckDataDTO
import apps.rundeck.domain.IconProvider
import apps.rundeck.domain.RunDeckModel
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject
import java.io.File
import java.net.URI
import java.util.*

data class GetRunDeckItemIcon(
    val itemId: UUID
) : Query<ByteArray>

class GetRunDeckItemIconQueryHandler @Inject constructor(
    private val model: RunDeckModel,
    private val iconProvider: IconProvider,
) : QueryHandler<GetRunDeckItemIcon, ByteArray> {
    override suspend fun handle(query: GetRunDeckItemIcon): ByteArray {
        val item = model.getItem(query.itemId)
            ?: TODO("error handling")

        val iconBytes = when (item) {
            is RunDeckDataDTO.Item.OpenUrl -> iconProvider.getForUrl(URI.create(item.url))
            is RunDeckDataDTO.Item.RunExecutable -> iconProvider.getForFile(File(item.executable))
        }

        return iconBytes
    }
}

