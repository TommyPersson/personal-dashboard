package apps.rundeck.domain

import apps.rundeck.application.config.RunDeckAppConfig
import apps.rundeck.application.contracts.RunDeckDataDTO
import jakarta.inject.Inject
import jakarta.inject.Singleton
import java.util.*

@Singleton
class RunDeckModel @Inject constructor(
    private val config: RunDeckAppConfig
) {
    private val data = RunDeckDataDTO.fromConfig(config)

    private val itemsById = data.sections
        .flatMap { it.rows }
        .flatMap { it.items }
        .associateBy { it.id }

    fun getData(): RunDeckDataDTO {
        return data
    }

    fun getItem(itemId: UUID): RunDeckDataDTO.Item? {
        return itemsById[itemId]
    }
}