import { Button, ButtonProps, IconButton, IconButtonProps, SvgIconProps, Tooltip } from "@mui/material"
import { CommandErrorPopover } from "@src/common/components/CommandError/CommandError.tsx"
import type { Command } from "@src/infrastructure/framework/commands/Command.ts"
import { useCommand } from "@src/infrastructure/framework/commands/useCommand.ts"
import React, { useRef } from "react"

type CommandArgsProps<TArgs> = void extends TArgs
  ? { args?: TArgs }
  // `null` while the arguments aren't available yet, which disables the button
  : { args: TArgs | null }

type CommonProps<TArgs, TResult> = {
  command: Command<TArgs, TResult>
  onSuccess?: (result: TResult, args: TArgs) => void
  disabled?: boolean
  /** Replaces the command's icon, e.g. for toggles whose icon follows a state. */
  icon?: React.ComponentType<SvgIconProps>
} & CommandArgsProps<TArgs>

export type CommandButtonProps<TArgs, TResult> = CommonProps<TArgs, TResult> & (
  | ({ iconOnly?: false } & Omit<ButtonProps, "onClick" | "children" | "disabled" | "color">)
  | ({ iconOnly: true } & Omit<IconButtonProps, "onClick" | "children" | "disabled" | "color">)
)

/**
 * A button that runs a command: labelled, iconed and colored by it, showing a spinner while it runs and its error in
 * a popover. With `iconOnly`, the label becomes the tooltip (unless the command has its own) and the accessible name.
 *
 * Clicks don't propagate, so the button can sit inside clickable areas such as card headers.
 */
export const CommandButton = <TArgs, TResult>(props: CommandButtonProps<TArgs, TResult>) => {
  const { command, args, onSuccess, disabled, iconOnly, icon, ...buttonProps } = props

  const state = useCommand(command, { onSuccess })
  const anchorRef = useRef<HTMLButtonElement | null>(null)

  const isDisabled = disabled || args === null || !state.canExecute(args as TArgs)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    state.execute(args as TArgs)
  }

  const Icon = icon ?? command.icon

  const button = iconOnly ? (
    <Tooltip title={command.tooltip ?? command.label}>
      {/* Disabled buttons don't fire the events the tooltip listens to */}
      <span>
        <IconButton
          {...buttonProps as IconButtonProps}
          ref={anchorRef}
          color={command.color}
          aria-label={command.label}
          onClick={handleClick}
          loading={state.isPending}
          disabled={isDisabled}
        >
          {Icon && <Icon />}
        </IconButton>
      </span>
    </Tooltip>
  ) : (
    <Tooltip title={command.tooltip ?? ""}>
      <span>
        <Button
          {...buttonProps as ButtonProps}
          ref={anchorRef}
          color={command.color}
          startIcon={Icon && <Icon />}
          onClick={handleClick}
          loading={state.isPending}
          disabled={isDisabled}
          children={command.label}
        />
      </span>
    </Tooltip>
  )

  return (
    <>
      {button}
      <CommandErrorPopover state={state} anchorEl={anchorRef.current} />
    </>
  )
}
