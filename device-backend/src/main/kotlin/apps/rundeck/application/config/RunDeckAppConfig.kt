package apps.rundeck.application.config

import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.annotation.JsonTypeName

data class RunDeckAppConfig(
    val sections: List<Section>
) {
    data class Section(
        val name: String,
        val rows: List<Row>,
    )

    data class Row(
        val items: List<Item>,
    )

    @JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type",
    )
    sealed class Item {
        val id: String? = null

        abstract val text: String

        @JsonTypeName("RunExecutable")
        data class RunExecutable(
            override val text: String,
            val executable: String,
        ) : Item()

        @JsonTypeName("OpenUrl")
        data class OpenUrl(
            override val text: String,
            val url: String,
        ) : Item()
    }
}