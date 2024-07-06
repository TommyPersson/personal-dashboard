package apps.mediacontrol.application.queries

import apps.mediacontrol.application.contracts.MediaControlStatusDTO
import apps.mediacontrol.application.contracts.MediaControlsStatusResponseDTO
import common.winctrl.WinCtrlCommandExecutor
import common.winctrl.commands.StatusCommandData
import common.winctrl.execute
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject

class GetMediaControlData : Query<MediaControlsStatusResponseDTO>

class GetMediaControlDataQueryHandler @Inject constructor(
    private val executor: WinCtrlCommandExecutor,
) : QueryHandler<GetMediaControlData, MediaControlsStatusResponseDTO> {
    override suspend fun handle(query: GetMediaControlData): MediaControlsStatusResponseDTO {
        val output = executor.execute<StatusCommandData>("system-media", "status")

        return MediaControlsStatusResponseDTO(
            status = output.Data?.let {
                MediaControlStatusDTO(
                    controls = MediaControlStatusDTO.Controls(
                        isPlayEnabled = output.Data.PlaybackInfo.Controls.IsPlayEnabled,
                        isPauseEnabled = output.Data.PlaybackInfo.Controls.IsPauseEnabled,
                        isPauseOrPlayEnabled = output.Data.PlaybackInfo.Controls.IsPlayPauseToggleEnabled,
                        isSkipNextEnabled = output.Data.PlaybackInfo.Controls.IsNextEnabled,
                        isSkipPreviousEnabled = output.Data.PlaybackInfo.Controls.IsPreviousEnabled,
                    ),
                    mediaInfo = MediaControlStatusDTO.MediaInfo(
                        artist = output.Data.MediaProperties.Artist,
                        title = output.Data.MediaProperties.Title,
                    ),
                    state = MediaControlStatusDTO.PlaybackState.valueOf(output.Data.PlaybackInfo.PlaybackStatus),
                )
            }
        )
    }
}