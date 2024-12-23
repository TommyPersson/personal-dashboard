import { Circle, CircleOutlined, LockOpenOutlined } from "@mui/icons-material"
import { Button, Fade, IconButton, Stack } from "@mui/material"
import { useDebounced } from "@src/infrastructure/hooks/useDebounced.ts"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { AppContext } from "@src/shell/state/ShellState.tsx"
import React, { useCallback, useContext, useEffect, useState } from "react"

import classes from "./UnlockKeyPad.module.scss"

export const UnlockWidget = () => {
  const state = useUnlockWidgetState()

  return (
    <div className={classes.UnlockWidget}>
      <UnlockActivatorButton state={state} />
      <UnlockKeyPad state={state} />
    </div>
  )
}

export const UnlockActivatorButton = (props: {
  state: UnlockWidgetState
}) => {
  const { state } = props

  if (state.isKeyPadVisible) {
    return
  }

  return (
    <IconButton
      onClick={state.showKeyPad}
      className={classes.UnlockActivatorButton}
    >
      <LockOpenOutlined />
    </IconButton>
  )
}

export const UnlockKeyPad = (props: {
  state: UnlockWidgetState
}) => {
  const { state } = props

  return (
    <Fade in={state.isKeyPadVisible} mountOnEnter={true} unmountOnExit={true}>
      <Stack className={classes.UnlockKeyPad}>
        <Stack direction={"row"} className={classes.PinDisplay}>
          {state.keyPadInput[0] != undefined ? <Circle fontSize={"large"} /> : <CircleOutlined fontSize={"large"} />}
          {state.keyPadInput[1] != undefined ? <Circle fontSize={"large"} /> : <CircleOutlined fontSize={"large"} />}
          {state.keyPadInput[2] != undefined ? <Circle fontSize={"large"} /> : <CircleOutlined fontSize={"large"} />}
          {state.keyPadInput[3] != undefined ? <Circle fontSize={"large"} /> : <CircleOutlined fontSize={"large"} />}
        </Stack>
        <div className={classes.ButtonPanel}>
          <DigitButton digit={"1"} onClick={state.handleKeyPadDigitClick} disabled={state.unlockInProgress} />
          <DigitButton digit={"2"} onClick={state.handleKeyPadDigitClick} disabled={state.unlockInProgress} />
          <DigitButton digit={"3"} onClick={state.handleKeyPadDigitClick} disabled={state.unlockInProgress} />
          <DigitButton digit={"4"} onClick={state.handleKeyPadDigitClick} disabled={state.unlockInProgress} />
          <DigitButton digit={"5"} onClick={state.handleKeyPadDigitClick} disabled={state.unlockInProgress} />
          <DigitButton digit={"6"} onClick={state.handleKeyPadDigitClick} disabled={state.unlockInProgress} />
          <DigitButton digit={"7"} onClick={state.handleKeyPadDigitClick} disabled={state.unlockInProgress} />
          <DigitButton digit={"8"} onClick={state.handleKeyPadDigitClick} disabled={state.unlockInProgress} />
          <DigitButton digit={"9"} onClick={state.handleKeyPadDigitClick} disabled={state.unlockInProgress} />
          <div />
          <DigitButton digit={"0"} onClick={state.handleKeyPadDigitClick} disabled={state.unlockInProgress} />
          <DigitButton digit={"X"} onClick={state.clearKeyPadInput} disabled={state.unlockInProgress} />
        </div>
      </Stack>
    </Fade>
  )
}

const DigitButton = (props: { digit: string, disabled?: boolean, onClick?: (digit: string) => void }) => {
  const { digit, disabled, onClick } = props

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClick?.(digit)
  }, [digit, onClick])

  return (
    <Button
      className={classes.DigitButton}
      variant={"contained"}
      disabled={disabled}
      children={props.digit}
      onClick={handleClick}
    />
  )
}

type UnlockWidgetState = {
  keyPadInput: string
  isKeyPadVisible: boolean
  unlockInProgress: boolean
  unlock: (input: string) => void
  handleKeyPadDigitClick: (digit: string) => void
  clearKeyPadInput: () => void
  showKeyPad: () => void
}

function useUnlockWidgetState(): UnlockWidgetState {
  const appContext = useContext(AppContext)
  const unlock = appContext.unlock

  const [input, setInput] = useState<string>("")
  const [visible, setVisible] = useState(false)

  const clearInput = useCallback(() => {
    setInput("")
  }, [setInput])

  const delayedHide = useDebounced(() => {
    setVisible(false)
    clearInput()
  }, 10_000, [setVisible, clearInput])

  const handleDigitClick = useCallback((digit: string) => {
    setInput(s => (s + digit).substring(0, 4))
    delayedHide()
  }, [setInput, delayedHide])

  const showKeyPad = useCallback(() => {
    setVisible(true)
  }, [setVisible])

  useEffect(() => {
    if (input.length >= 4) {
      clearInput()
      unlock(input)
    }
  }, [input, clearInput, unlock])

  useEffect(() => {
    delayedHide();
  }, [visible, delayedHide])

  useEffect(() => {
    setVisible(false)
  }, [appContext.isUnlocked])

  return useDeepEqualMemo(() => ({
    keyPadInput: input,
    isKeyPadVisible: visible,
    unlockInProgress: appContext.unlockInProgress,
    unlock: appContext.unlock,
    handleKeyPadDigitClick: handleDigitClick,
    clearKeyPadInput: clearInput,
    showKeyPad: showKeyPad,
  }), [input, visible, appContext, handleDigitClick, clearInput])
}
