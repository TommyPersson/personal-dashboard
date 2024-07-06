package apps.hotkeys.domain

import apps.hotkeys.application.config.HotKeysAppConfig
import apps.hotkeys.application.contracts.HotKeysDataDTO
import common.services.ProcessService
import jakarta.inject.Inject
import jakarta.inject.Singleton
import java.util.*

@Singleton
class HotKeysModel @Inject constructor(
    private val config: HotKeysAppConfig,
    private val processService: ProcessService
) {
    private val fullData = HotKeysDataDTO(sections = config.sections.map { section ->
        HotKeysDataDTO.Section(
            name = section.name,
            hotKeys = section.hotKeys.map { hotKey ->
                HotKeysDataDTO.HotKey(
                    id = UUID.randomUUID(),
                    name = hotKey.name,
                    keys = hotKey.keys,
                )
            }
        )
    })

    suspend fun getData(): HotKeysDataDTO {
        val processName = processService.getActiveProcessName()

        val configuredSections = config.sections
            .filter { it.processNameMatches?.matches(processName ?: "NO_SUCH_PROCESS") ?: true }
            .map { it.name }

        return fullData.copy(
            sections = fullData.sections.filter { configuredSections.contains(it.name) }
        )
    }

    fun getHotKey(hotKeyId: UUID): HotKeysDataDTO.HotKey? {
        val allHotKeys = fullData.sections.flatMap { it.hotKeys }
        return allHotKeys.firstOrNull { it.id == hotKeyId }
    }
}

