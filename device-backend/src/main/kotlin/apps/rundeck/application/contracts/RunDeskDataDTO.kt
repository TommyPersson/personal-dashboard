package apps.rundeck.application.contracts

import apps.rundeck.application.config.RunDeckAppConfig
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.annotation.JsonTypeName
import java.util.UUID

data class RunDeckDataDTO(
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
        abstract val id: UUID
        abstract val text: String

        @JsonTypeName("RunExecutable")
        data class RunExecutable(
            override val id: UUID,
            override val text: String,
            val executable: String,
        ) : Item()

        @JsonTypeName("OpenUrl")
        data class OpenUrl(
            override val id: UUID,
            override val text: String,
            val url: String,
        ) : Item()
    }

    companion object {
        fun fromConfig(config: RunDeckAppConfig): RunDeckDataDTO {
            return RunDeckDataDTO(
                sections = config.sections.map { section ->
                    Section(
                        name = section.name,
                        rows = section.rows.map { row ->
                            Row(
                                items = row.items.map(Companion::itemFromConfig))
                        }
                    )
                }
            )
        }

        private fun itemFromConfig(item: RunDeckAppConfig.Item): Item {
            return when (item) {
                is RunDeckAppConfig.Item.OpenUrl -> {
                    Item.OpenUrl(
                        id = UUID.randomUUID(),
                        text = item.text,
                        url = item.url,
                    )
                }

                is RunDeckAppConfig.Item.RunExecutable -> {
                    Item.RunExecutable(
                        id = UUID.randomUUID(),
                        text = item.text,
                        executable = item.executable,
                    )
                }
            }
        }
    }
}