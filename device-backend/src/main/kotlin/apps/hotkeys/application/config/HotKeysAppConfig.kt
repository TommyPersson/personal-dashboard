package apps.hotkeys.application.config

data class HotKeysAppConfig(
    val sections: List<Section>
) {
    data class Section(
        val name: String,
        val processNameMatches: Regex?,
        val hotKeys: List<HotKey>,
    )

    data class HotKey(
        val name: String,
        val keys: String,
    )
}