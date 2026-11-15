import type { Command } from "@src/infrastructure/framework/commands/Command.ts"
import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"

export type UseCommandOptions<TArgs, TResult> = {
  onSuccess?: (result: TResult, args: TArgs) => void
}

export type CommandState<TArgs, TResult> = {
  command: Command<TArgs, TResult>
  /** Runs the command, unless `canExecute` rejects the arguments. Failures end up in `error`. */
  execute: (args: TArgs) => void
  canExecute: (args: TArgs) => boolean
  isPending: boolean
  isSuccess: boolean
  error: Error | null
  /** Clears `error` and `isSuccess`. */
  reset: () => void
}

/** Binds a command to a mutation of the component, exposing its loading/success/error state. */
export function useCommand<TArgs, TResult>(
  command: Command<TArgs, TResult>,
  options: UseCommandOptions<TArgs, TResult> = {},
): CommandState<TArgs, TResult> {
  const { onSuccess } = options

  const mutation = useMutation(command.mutationOptions)
  const { mutate } = mutation

  const canExecute = useCallback((args: TArgs) => {
    return command.canExecute?.(args) ?? true
  }, [command])

  const execute = useCallback((args: TArgs) => {
    if (!canExecute(args)) {
      return
    }
    mutate(args, { onSuccess: onSuccess ? (result) => onSuccess(result, args) : undefined })
  }, [canExecute, mutate, onSuccess])

  return {
    command,
    execute,
    canExecute,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  }
}
