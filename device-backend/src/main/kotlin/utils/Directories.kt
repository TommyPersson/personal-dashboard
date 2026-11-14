package utils

import java.io.File

object Directories {

    private val dataDir = System.getenv("DATA_DIR")?.let { File(it) }
        ?: File(System.getProperty("user.home"), ".personal-dashboard")

    val Configs = File(dataDir, "config").also {
        it.mkdirs()
    }

    val AppConfigs = File(Configs, "apps").also {
        it.mkdirs()
    }

    val Cache = File(dataDir, "cache").also {
        it.mkdirs()
    }

    val Data = File(dataDir, "data").also {
        it.mkdirs()
    }
}