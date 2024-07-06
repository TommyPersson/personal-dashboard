package framework

import io.ktor.server.application.*

interface AppModule {
    fun setup(app: Application): Unit
}