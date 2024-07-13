package framework

import io.ktor.server.application.*
import java.awt.Menu

interface AppModule {
    fun setup(app: Application): Unit

    val trayIconMenu: Menu? get() = null
}