import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { useObjectState } from "@src/infrastructure/framework/entities/internal/useObjectState.tsx"
import { useCallback, useEffect, useMemo } from "react"

export type ActionStateValue<TArgs, TResult> = {
  readonly key: string
  readonly args: TArgs | null
  readonly result: TResult | null
  readonly isInProgress: boolean
  readonly error: Error | null
}

export type ActionState<TArgs, TResult> = ActionStateValue<TArgs, TResult> & {
  readonly executeAsync: (args: TArgs) => void
  readonly execute: (args: TArgs) => Promise<TResult>
  readonly reset: () => void
}

export type ActionType<TArgs, TValue, TPayload = any> = {
  readonly key: string
  readonly action: (args: TArgs) => Promise<TPayload>
  readonly transform?: (payload: TPayload) => TValue
  readonly __type?: TValue
  readonly __payloadType?: TPayload
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type UseActionOptions = {
}

export function useAction<TArgs, TResult = void, TPayload = any>(
  type: ActionType<TArgs, TResult, TPayload>,
  options: UseActionOptions = {},
): ActionState<TArgs, TResult> {

  const { key, action, transform } = type

  const { state, set } = useObjectState<ActionStateValue<TArgs, TResult>>(key)

  const execute = useCallback(async (args: TArgs) => {
    try {
      set(s => ({
        key,
        args: args,
        result: null,
        error: null,
        isInProgress: true,
      }))
      const payload = await action(args)
      let result: TResult
      if (type.transform) {
        result = type.transform(payload)
      } else {
        result = payload as TResult
      }
      set({
        key,
        args: args,
        result: result,
        error: null,
        isInProgress: false,
      })
      return result
    } catch (e) {
      set({
        key,
        args: args,
        result: null,
        error: e as Error,
        isInProgress: false,
      })
      throw e
    }
  }, [key, action, transform, set])

  const executeAsync = useCallback((args: TArgs) => {
    execute(args).then()
  }, [execute])

  const reset = useCallback(() => {
    set({
      key,
      error: null,
      isInProgress: false,
      result: null,
      args: null,
    })
  }, [key, set])

  return useMemo(() => ({
    execute: execute,
    executeAsync: executeAsync,
    reset: reset,
    key: key,
    args: state?.args ?? null,
    result: state?.result ?? null,
    isInProgress: state?.isInProgress ?? false,
    error: state?.error ?? null,
  }), [key, state, execute, reset])
}
