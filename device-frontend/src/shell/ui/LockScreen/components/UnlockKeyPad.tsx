import { Circle } from "@mui/icons-material"
import { Button, Stack } from "@mui/material"
import { AppContext } from "@src/shell/state/ShellState.tsx"
import React, { useCallback, useContext, useEffect, useState } from "react"

import classes from "./UnlockKeyPad.module.scss"

export const UnlockKeyPad = () => {
  const { unlock } = useContext(AppContext)

  const [input, setInput] = useState<string>("")

  const clearInput = useCallback(() => {
    setInput("")
  }, [setInput])

  const handleDigitClick = useCallback((digit: string) => {
    setInput(s => (s + digit).substring(0, 4))
  }, [setInput])

  useEffect(() => {
    if (input.length >= 4) {
      clearInput()
      unlock()
    }
  }, [input, clearInput, unlock])

  return (
    <Stack className={classes.UnlockKeyPad}>
      <Stack direction={"row"} className={classes.PinDisplay}>
        {input[0] != undefined ? <Circle fontSize={"large"} /> : undefined}
        {input[1] != undefined ? <Circle fontSize={"large"} /> : undefined}
        {input[2] != undefined ? <Circle fontSize={"large"} /> : undefined}
        {input[3] != undefined ? <Circle fontSize={"large"} /> : undefined}
      </Stack>
      <div className={classes.ButtonPanel}>
        <DigitButton digit={"1"} onClick={handleDigitClick} />
        <DigitButton digit={"2"} onClick={handleDigitClick} />
        <DigitButton digit={"3"} onClick={handleDigitClick} />
        <DigitButton digit={"4"} onClick={handleDigitClick} />
        <DigitButton digit={"5"} onClick={handleDigitClick} />
        <DigitButton digit={"6"} onClick={handleDigitClick} />
        <DigitButton digit={"7"} onClick={handleDigitClick} />
        <DigitButton digit={"8"} onClick={handleDigitClick} />
        <DigitButton digit={"9"} onClick={handleDigitClick} />
        <div />
        <DigitButton digit={"0"} />
        <DigitButton digit={"X"} onClick={clearInput} />
      </div>
    </Stack>
  )
}

const DigitButton = (props: { digit: string, onClick?: (digit: string) => void }) => {
  const { digit, onClick } = props

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClick?.(digit)
  }, [digit, onClick])

  return (
    <Button
      className={classes.DigitButton}
      variant={"contained"}
      children={props.digit}
      onClick={handleClick}
    />
  )
}