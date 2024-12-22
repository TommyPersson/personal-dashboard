package core.layout.application.contracts

data class GetLayoutResponseDTO(
    val apps: List<App>
) {
    data class App(val appId: String)
}