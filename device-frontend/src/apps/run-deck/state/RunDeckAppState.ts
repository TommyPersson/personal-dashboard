import { Item, Section } from "@src/apps/run-deck/models/RunDeckData.ts"
import { RunItemActionMutation } from "@src/apps/run-deck/mutations/RunItemActionMutation.ts"
import { RunDeckDataQuery } from "@src/apps/run-deck/queries/RunDeckDataQuery.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

export type RunDeckAppState = {
  sections: Section[]
  runItemAction: (item: Item) => void
}

export function useRunDeckAppState(): RunDeckAppState {
  const query = useQuery({
    ...RunDeckDataQuery,
    refetchInterval: 5000,
  })

  const { mutate: runItemActionMutate } = useMutation(RunItemActionMutation)

  const sections = query.data?.sections ?? EmptyArray

  const runItemAction = useCallback((item: Item) => {
    runItemActionMutate({ itemId: item.id })
  }, [runItemActionMutate])

  return useDeepEqualMemo(() => ({
    sections,
    runItemAction,
  }), [sections, runItemAction])
}
