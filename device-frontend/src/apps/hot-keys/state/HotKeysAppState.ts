import { HotKeySection } from "@src/apps/hot-keys/models/HotKeysData.ts"
import { HotKeysDataQuery } from "@src/apps/hot-keys/queries/HotKeysDataQuery.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useQuery } from "@tanstack/react-query"

export type HotKeysAppState = {
  sections: HotKeySection[]
}

export function useHotKeysAppState(): HotKeysAppState {
  const query = useQuery({
    ...HotKeysDataQuery,
    refetchInterval: 5000,
  })

  const sections = query.data?.sections ?? EmptyArray

  return useDeepEqualMemo(() => ({
    sections,
  }), [sections])
}
