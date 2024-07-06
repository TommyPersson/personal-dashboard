package apps.mediacontrol.application

import apps.mediacontrol.application.commands.PauseOrPlayMediaCommandHandler
import apps.mediacontrol.application.commands.SkipNextMediaCommandHandler
import apps.mediacontrol.application.commands.SkipPreviousMediaCommandHandler
import apps.mediacontrol.application.queries.GetMediaControlDataQueryHandler
import apps.mediacontrol.application.queries.GetMediaThumbnailQueryHandler
import com.google.inject.Binder
import com.google.inject.Module
import framework.guice.bindAppModule
import framework.guice.bindRequestHandler

class MediaControlGuiceModule : Module {
    override fun configure(binder: Binder) {
        binder.bindAppModule<MediaControlAppModule>()
        binder.bindRequestHandler<GetMediaControlDataQueryHandler>()
        binder.bindRequestHandler<GetMediaThumbnailQueryHandler>()
        binder.bindRequestHandler<PauseOrPlayMediaCommandHandler>()
        binder.bindRequestHandler<SkipNextMediaCommandHandler>()
        binder.bindRequestHandler<SkipPreviousMediaCommandHandler>()
    }
}