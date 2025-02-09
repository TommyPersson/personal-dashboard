package apps.mediacontrol.application.queries

import apps.mediacontrol.application.contracts.MediaControlStatusDTO
import apps.mediacontrol.application.contracts.MediaControlsStatusResponseDTO
import common.winctrl.WinCtrlFacade
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject

class GetMediaControlData : Query<MediaControlsStatusResponseDTO>

class GetMediaControlDataQueryHandler @Inject constructor(
    private val winCtrl: WinCtrlFacade,
) : QueryHandler<GetMediaControlData, MediaControlsStatusResponseDTO> {
    override suspend fun handle(query: GetMediaControlData): MediaControlsStatusResponseDTO {
        val output = winCtrl.mediaControl.getStatus()

        return MediaControlsStatusResponseDTO(
            status = output?.let {
                MediaControlStatusDTO(
                    controls = MediaControlStatusDTO.Controls(
                        isPlayEnabled = output.PlaybackInfo.Controls.IsPlayEnabled,
                        isPauseEnabled = output.PlaybackInfo.Controls.IsPauseEnabled,
                        isPauseOrPlayEnabled = output.PlaybackInfo.Controls.IsPlayPauseToggleEnabled,
                        isSkipNextEnabled = output.PlaybackInfo.Controls.IsNextEnabled,
                        isSkipPreviousEnabled = output.PlaybackInfo.Controls.IsPreviousEnabled,
                    ),
                    mediaInfo = MediaControlStatusDTO.MediaInfo(
                        artist = output.MediaProperties.Artist,
                        title = output.MediaProperties.Title,
                    ),
                    state = MediaControlStatusDTO.PlaybackState.valueOf(output.PlaybackInfo.PlaybackStatus),
                )
            }
        )
    }
}