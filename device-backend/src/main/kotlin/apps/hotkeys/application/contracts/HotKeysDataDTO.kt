package apps.hotkeys.application.contracts

import java.util.UUID

data class HotKeysDataDTO(
    val sections: List<Section>
) {
    data class Section(
        val name: String,
        val hotKeys: List<HotKey>,
    )

    data class HotKey(
        val id: UUID,
        val name: String,
        val keys: String,
    )
}