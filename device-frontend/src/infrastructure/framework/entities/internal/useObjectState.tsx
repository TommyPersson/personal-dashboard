import { EntityStateContext } from "@src/infrastructure/framework/entities/EntityStateContext.tsx"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"

export type UseObjectStateHook<TValue extends object> = {
  state: TValue | null
  set: (value: TValue | ((value: TValue | null) => TValue)) => void
}

export function useObjectState<TValue extends object>(key: string): UseObjectStateHook<TValue> {
  const { get, set, subscribe, unsubscribe } = useContext(EntityStateContext)

  const [state, setState] = useState<TValue | null>(get(key))

  const handleStateChanged = useCallback((updatedKey: string, value: TValue | null) => {
    if (updatedKey === key) {
      setState(value)
    }
  }, [setState, key])

  const setWithKey = useCallback((value: TValue | ((value: TValue | null) => TValue)) => {
    set(key, value as any) // TODO figure out typing error
  }, [key, set])

  useEffect(() => {
    subscribe(handleStateChanged)

    return () => unsubscribe(handleStateChanged)
  }, [subscribe, unsubscribe, handleStateChanged])

  return useMemo(() => ({
    state: state,
    set: setWithKey,
  }), [state, set])
}
