import { Alert, AlertProps, AlertTitle, Popover } from "@mui/material"
import type { CommandState } from "@src/infrastructure/framework/commands/useCommand.ts"
import React from "react"

/**
 * The error of a failed command, titled by the command and dismissed by resetting it. Renders nothing while there is no
 * error. Clicks don't propagate, so it can sit inside clickable areas.
 */
export const CommandErrorAlert = (props: { state: CommandState<any, any> } & Omit<AlertProps, "onClose">) => {
  const { state, ...alertProps } = props
  const { command, error, reset } = state

  if (!error) {
    return null
  }

  return (
    <Alert severity={"error"} {...alertProps} onClose={reset} onClick={stopPropagation}>
      <AlertTitle>{command.errorTitle ?? `${command.label} failed`}</AlertTitle>
      {error.message}
    </Alert>
  )
}

/** A `CommandErrorAlert` in a popover below `anchorEl`, for commands bound to a button. */
export const CommandErrorPopover = (props: { state: CommandState<any, any>, anchorEl: HTMLElement | null }) => {
  const { state, anchorEl } = props

  return (
    <Popover
      open={!!state.error}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      onClose={state.reset}
      // The popover is portalled, but its clicks would still bubble to its React ancestors
      onClick={stopPropagation}
    >
      <CommandErrorAlert state={state} />
    </Popover>
  )
}

function stopPropagation(e: React.MouseEvent) {
  e.stopPropagation()
}
