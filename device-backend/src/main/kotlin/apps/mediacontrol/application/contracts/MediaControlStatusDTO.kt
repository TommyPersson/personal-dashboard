package apps.mediacontrol.application.contracts

data class MediaControlStatusDTO(
    val controls: Controls,
    val mediaInfo: MediaInfo,
    val state: PlaybackState,
) {
    data class Controls(
        val isPlayEnabled: Boolean,
        val isPauseEnabled: Boolean,
        val isPauseOrPlayEnabled: Boolean,
        val isSkipNextEnabled: Boolean,
        val isSkipPreviousEnabled: Boolean,
    )

     data class MediaInfo(
         val artist: String,
         val title: String,
     )

    enum class PlaybackState {
        Closed,
        Opened,
        Changing,
        Stopped,
        Playing,
        Paused,
    }
}