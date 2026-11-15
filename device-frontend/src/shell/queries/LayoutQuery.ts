import { allAppWidgetProviders } from "@src/apps/AllAppWidgetProviders.ts"
import { AppWidgetProvider } from "@src/common/AppWidgetProvider.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { Layout, LayoutDTOSchema } from "@src/shell/models/Layout.ts"
import { queryOptions } from "@tanstack/react-query"

export const LayoutQueryKey = ["shell", "layout"] as const

export const LayoutQuery = queryOptions({
  queryKey: LayoutQueryKey,
  queryFn: async (): Promise<Layout> => {
    const dto = LayoutDTOSchema.parse(await apiClient.get<unknown>("/api/layout"))
    return {
      apps: dto.apps
        .map(it => allAppWidgetProviders.find(p => p.id === it.appId))
        .filter((it): it is AppWidgetProvider => !!it),
    }
  },
})
