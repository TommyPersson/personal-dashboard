import { PerformHotKeyAction } from "@src/apps/hot-keys/actions"
import { HotKeysDataEntity } from "@src/apps/hot-keys/entities/HotKeysDataEntity.ts"
import { HotKey, HotKeySection } from "@src/apps/hot-keys/models/HotKeysData.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useAction } from "@src/infrastructure/framework/entities/useAction.tsx"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useCallback, useMemo } from "react"

export type HotKeysAppState = {
  sections: HotKeySection[]
  execute: (hotKey: HotKey) => void
}

export function useHotKeysAppState(): HotKeysAppState {
  const entity = useEntity(HotKeysDataEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  const sendKeysAction = useAction(PerformHotKeyAction)

  useInterval(entity.fetchAsync, 5000)

  const sections = entity.value?.sections ?? EmptyArray

  const execute = useCallback((hotKey: HotKey) => {
    sendKeysAction.executeAsync({ hotKeyId: hotKey.id })
  }, [sendKeysAction])

  return useDeepEqualMemo(() => ({
    sections,
    execute,
  }), [sections, execute])
}