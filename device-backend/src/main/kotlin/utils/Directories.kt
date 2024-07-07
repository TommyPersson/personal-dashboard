package utils

import java.io.File

object Directories {
    private val base = File(System.getProperty("user.home"), ".personal-dashboard")

    val Configs = File(base, "config").also {
        it.mkdirs()
    }

    val AppConfigs = File(Configs, "apps").also {
        it.mkdirs()
    }

    val Cache = File(base, "cache").also {
        it.mkdirs()
    }

    val Data = File(base, "data").also {
        it.mkdirs()
    }
}