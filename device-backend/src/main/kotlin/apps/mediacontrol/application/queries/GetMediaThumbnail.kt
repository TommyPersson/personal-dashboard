package apps.mediacontrol.application.queries

import common.winctrl.WinCtrlCommandExecutor
import common.winctrl.commands.ThumbnailCommandData
import common.winctrl.execute
import framework.mediator.Query
import framework.mediator.QueryHandler
import jakarta.inject.Inject

class GetMediaThumbnail : Query<ByteArray?>

class GetMediaThumbnailQueryHandler @Inject constructor(
    private val executor: WinCtrlCommandExecutor,
) : QueryHandler<GetMediaThumbnail, ByteArray?> {
    override suspend fun handle(query: GetMediaThumbnail): ByteArray? {
        val output = executor.execute<ThumbnailCommandData>("system-media", "thumbnail")

        return output.Data?.Bytes
    }
}