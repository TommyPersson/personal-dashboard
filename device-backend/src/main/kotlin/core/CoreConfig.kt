package core

data class CoreConfig(
    val winCtrl: WinCtrl
) {
    data class WinCtrl(
        val executablePath: String
    )
}