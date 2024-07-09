import { RunItemActionAction } from "@src/apps/run-deck/actions"
import { RunDeckDataEntity } from "@src/apps/run-deck/entities/RunDeckDataEntity.ts"
import { Item, Section } from "@src/apps/run-deck/models/RunDeckData.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useAction } from "@src/infrastructure/framework/entities/useAction.tsx"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import { useCallback, useMemo } from "react"

export type RunDeckAppState = {
  sections: Section[]
  runItemAction: (item: Item) => void
}

export function useRunDeckAppState(): RunDeckAppState {
  const entity = useEntity(RunDeckDataEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  const runItemActionAction = useAction(RunItemActionAction)

  useInterval(entity.fetchAsync, 5000)

  const sections = entity.value?.sections ?? EmptyArray

  const runItemAction = useCallback((item: Item) => {
    runItemActionAction.executeAsync({ itemId: item.id })
  }, [runItemActionAction])


  return useMemo(() => ({
    sections,
    runItemAction: runItemAction,
  }), [sections, runItemAction])
}
