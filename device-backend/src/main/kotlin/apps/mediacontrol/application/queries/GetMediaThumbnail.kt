package apps.mediacontrol.application.queries

import common.winctrl.WinCtrlFacade
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject

class GetMediaThumbnail : Query<ByteArray?>

class GetMediaThumbnailQueryHandler @Inject constructor(
    private val winCtrl: WinCtrlFacade,
) : QueryHandler<GetMediaThumbnail, ByteArray?> {
    override suspend fun handle(query: GetMediaThumbnail): ByteArray? {
        val thumbnailBytes = winCtrl.mediaControl.getThumbnailBytes()

        return thumbnailBytes
    }
}