package core

data class CoreConfig(
    val winCtrl: WinCtrl,
    val auth: Auth,
) {
    data class WinCtrl(
        val executablePath: String
    )

    data class Auth(
        val pinCode: String,
        val jwtSecret: String,
        val sessionTimeoutMinutes: Long = 480,
    )
}