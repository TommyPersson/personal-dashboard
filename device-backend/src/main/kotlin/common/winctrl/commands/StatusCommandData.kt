package common.winctrl.commands

data class StatusCommandData(
    val PlaybackInfo: PlaybackInfoData,
    val MediaProperties: MediaPropertiesData,
) {
    data class PlaybackInfoData(
        val Controls: ControlsData,
        val PlaybackStatus: String,
    ) {
        data class ControlsData(
            val IsPlayEnabled: Boolean,
            val IsPauseEnabled: Boolean,
            val IsPlayPauseToggleEnabled: Boolean,
            val IsNextEnabled: Boolean,
            val IsPreviousEnabled: Boolean,
        )
    }

    data class MediaPropertiesData(
        val Artist: String,
        val Title: String,
    )
}