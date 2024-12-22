import { allAppWidgetProviders } from "@src/apps/AllAppWidgetProviders.ts"
import { EntityType } from "@src/infrastructure/framework/entities"
import { LayoutDTO } from "@src/shell/contracts/LayoutDTO.ts"
import { Layout } from "@src/shell/models/Layout.ts"

export const LayoutEntity: EntityType<Layout> = {
  key: "core/layout",
  fetchUrl: "/api/layout",
  transform: (layout: LayoutDTO): Layout => ({
    apps: layout.apps
      .map(it => allAppWidgetProviders.find(p => p.id === it.appId)!)
      .filter(it => it)
  })
}