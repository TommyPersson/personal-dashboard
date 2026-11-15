import { HotKey, HotKeySection } from "@src/apps/hot-keys/models/HotKeysData.ts"
import { PerformHotKeyMutation } from "@src/apps/hot-keys/mutations/PerformHotKeyMutation.ts"
import { HotKeysDataQuery } from "@src/apps/hot-keys/queries/HotKeysDataQuery.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

export type HotKeysAppState = {
  sections: HotKeySection[]
  execute: (hotKey: HotKey) => void
}

export function useHotKeysAppState(): HotKeysAppState {
  const query = useQuery({
    ...HotKeysDataQuery,
    refetchInterval: 5000,
  })

  const { mutate: performHotKey } = useMutation(PerformHotKeyMutation)

  const sections = query.data?.sections ?? EmptyArray

  const execute = useCallback((hotKey: HotKey) => {
    performHotKey({ hotKeyId: hotKey.id })
  }, [performHotKey])

  return useDeepEqualMemo(() => ({
    sections,
    execute,
  }), [sections, execute])
}
