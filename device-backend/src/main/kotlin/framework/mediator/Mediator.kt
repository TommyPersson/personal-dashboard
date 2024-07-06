package framework.mediator

import jakarta.inject.Inject
import kotlin.reflect.KClass
import kotlin.reflect.full.allSupertypes
import kotlin.reflect.full.starProjectedType

class Mediator @Inject constructor(
    private val requestHandlers: Set<RequestHandlerMarker>
) {
    private val requestHandlerByRequestType: Map<KClass<out Request<*>>, RequestHandler<*, *>> =
        requestHandlers.associate {
            val handlerClass = it::class.allSupertypes.first {
                it.classifier == RequestHandler::class.starProjectedType.classifier
            }

            val handler = it as RequestHandler<*, *>
            val requestClass = handlerClass.arguments[0].type!!.classifier as KClass<Request<*>>

            requestClass to handler
        }

    suspend fun <TResponse> send(request: Request<TResponse>): TResponse {
        val requestClass = request::class
        val handler = requestHandlerByRequestType[requestClass] as? RequestHandler<Request<TResponse>, TResponse>
            ?: error("No handler configured for: '${requestClass.simpleName}'")

        return handler.handle(request)
    }
}

interface Request<TResponse>

interface Query<TResponse> : Request<TResponse>

interface Command<TResponse> : Request<TResponse>

interface RequestHandlerMarker

interface RequestHandler<TRequest : Request<TResponse>, TResponse> : RequestHandlerMarker {
    suspend fun handle(request: TRequest): TResponse
}

interface QueryHandler<TQuery : Request<TResponse>, TResponse> : RequestHandler<TQuery, TResponse> {
    @Suppress("PARAMETER_NAME_CHANGED_ON_OVERRIDE")
    override suspend fun handle(query: TQuery): TResponse
}

interface CommandHandler<TCommand : Request<TResponse>, TResponse> : RequestHandler<TCommand, TResponse> {
    @Suppress("PARAMETER_NAME_CHANGED_ON_OVERRIDE")
    override suspend fun handle(command: TCommand): TResponse
}