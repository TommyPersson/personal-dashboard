import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { useObjectState } from "@src/infrastructure/framework/entities/internal/useObjectState.tsx"
import { useCallback, useEffect, useMemo } from "react"

export type EntityStateValue<TValue> = {
  readonly key: string
  readonly value: TValue | null
  readonly isLoading: boolean
  readonly error: Error | null
  readonly lastFetchedAt: Date | null
}

export type EntityState<TValue> = EntityStateValue<TValue> & {
  readonly fetchAsync: () => void
  readonly clear: () => void
}

export type EntityType<TValue, TPayload = any> = {
  readonly key: string
  readonly fetchUrl: string
  readonly transform?: (payload: TPayload) => TValue
  readonly __type?: TValue
  readonly __payloadType?: TPayload
}

export type UseEntityOptions = {
  readonly fetchOnMount?: boolean
  readonly clearOnFetch?: boolean
}

export function useEntity<TValue, TPayload = any>(
  type: EntityType<TValue, TPayload>,
  options: UseEntityOptions = {},
): EntityState<TValue> {

  const { key, fetchUrl, transform } = type

  const { state, set } = useObjectState<EntityStateValue<TValue>>(key)

  const fetchAsync = useCallback(async () => {
    const clearOnFetch = options.clearOnFetch !== false

    try {
      set(s => ({
        key,
        error: null,
        isLoading: true,
        value: clearOnFetch ? null : s?.value ?? null,
        lastFetchedAt: clearOnFetch ? null : s?.lastFetchedAt ?? null,
      }))
      const payload = await apiClient.get<TPayload>(fetchUrl)
      let value: TValue
      if (type.transform) {
        value = type.transform(payload)
      } else {
        value = payload as TValue
      }
      set({
        key,
        error: null,
        isLoading: false,
        value: value,
        lastFetchedAt: new Date(),
      })
    } catch (e) {
      set({
        key,
        error: e as Error,
        isLoading: false,
        value: null,
        lastFetchedAt: null,
      })
    }
  }, [key, fetchUrl, transform, set])

  const clear = useCallback(() => {
    set({
      key,
      error: null,
      isLoading: false,
      value: null,
      lastFetchedAt: null,
    })
  }, [key, set])

  useEffect(() => {
    if (options.fetchOnMount) {
      fetchAsync().then()
    }

    return () => {
      if (options.fetchOnMount) {
        clear()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUrl])

  return useMemo(() => ({
    fetchAsync: fetchAsync,
    clear: clear,
    key: key,
    value: state?.value ?? null,
    isLoading: state?.isLoading ?? false,
    error: state?.error ?? null,
    lastFetchedAt: state?.lastFetchedAt ?? null
  }), [key, state, fetchAsync, clear])
}
