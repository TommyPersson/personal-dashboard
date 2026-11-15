import type { ButtonProps, IconButtonProps, SvgIconProps } from "@mui/material"
import type { UseMutationOptions } from "@tanstack/react-query"
import type React from "react"

/**
 * A user-facing action: a mutation together with how it is presented (label, icon, tooltip, ...), so every control
 * that runs it looks and behaves the same. Bind it to the UI with `CommandButton`, or with `useCommand` for anything
 * else.
 *
 * The presentation is deliberately part of the command, so the same command can be offered by different kinds of
 * controls (a button today; a list item or menu item later), each using the properties as suits it, e.g. a menu item
 * shows the label next to the icon and needs no tooltip. Keep the properties about what the command is, not about
 * how one control lays it out.
 *
 * `TArgs` are the mutation's variables (`void` for commands without arguments).
 */
export type Command<TArgs = void, TResult = unknown> = {
  /** The command's mutation, defined in place. Code that needs the mutation itself uses it through the command. */
  mutationOptions: UseMutationOptions<TResult, Error, TArgs, any>
  label: string
  /** A component rather than an element, so command definitions can live in plain `.ts` files. */
  icon?: React.ComponentType<SvgIconProps>
  /** Defaults to the label. */
  tooltip?: string
  /** Limited to the colors both `Button` and `IconButton` support. */
  color?: ButtonProps["color"] & IconButtonProps["color"]
  /** Shown above the error message when the command fails. */
  errorTitle?: string
  /** Disables the command for the given arguments. */
  canExecute?: (args: TArgs) => boolean
}

/** Infers the command's types from its mutation options. */
export function defineCommand<TArgs, TResult>(command: Command<TArgs, TResult>): Command<TArgs, TResult> {
  return command
}
