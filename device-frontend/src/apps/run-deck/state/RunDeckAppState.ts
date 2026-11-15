import { Section } from "@src/apps/run-deck/models/RunDeckData.ts"
import { RunDeckDataQuery } from "@src/apps/run-deck/queries/RunDeckDataQuery.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useQuery } from "@tanstack/react-query"

export type RunDeckAppState = {
  sections: Section[]
}

export function useRunDeckAppState(): RunDeckAppState {
  const query = useQuery({
    ...RunDeckDataQuery,
    refetchInterval: 5000,
  })

  const sections = query.data?.sections ?? EmptyArray

  return useDeepEqualMemo(() => ({
    sections,
  }), [sections])
}
