package apps.bitbucket.application

import BitbucketApiClient
import apps.bitbucket.application.config.BitbucketAppConfig
import apps.bitbucket.application.queries.GetPullRequestsQueryHandler
import apps.bitbucket.infrastructure.BitbucketApiClientImpl
import com.google.inject.Binder
import com.google.inject.Module
import framework.guice.bindAppConfig
import framework.guice.bindAppModule
import framework.guice.bindRequestHandler


class BitbucketGuiceModule : Module {
    override fun configure(binder: Binder) {
        binder.bindAppModule<BitbucketAppModule>()
        binder.bindAppConfig<BitbucketAppConfig>("bitbucket")

        binder.bindRequestHandler<GetPullRequestsQueryHandler>()

        binder.bind(BitbucketApiClient::class.java).to(BitbucketApiClientImpl::class.java)
    }
}