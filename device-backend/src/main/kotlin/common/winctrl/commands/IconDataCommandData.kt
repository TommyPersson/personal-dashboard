package common.winctrl.commands

data class IconDataCommandData(
    val Index: String,
    val Width: String,
    val Height: String,
    val ContentType: String,
    val Bytes: ByteArray,
)