package core

data class CoreConfig(
    val winCtrl: WinCtrl,
    val auth: Auth,
    val layout: Layout,
) {
    data class WinCtrl(
        val url: String,
    )

    data class Auth(
        val pinCode: String,
        val jwtSecret: String,
        val sessionTimeoutMinutes: Long = 480,
    )

    data class Layout(
        val apps: List<App>,
    ) {
        data class App(
            val appId: String,
        )
    }
}