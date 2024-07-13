import { Box, Slide, Stack } from "@mui/material"
import { AppContext } from "@src/shell/state/ShellState.tsx"
import { UnlockKeyPad } from "@src/shell/ui/LockScreen/components/UnlockKeyPad.tsx"
import React, { useContext } from "react"
import classes from "./LockScreen.module.scss"

export const LockScreen = () => {
  const appContext = useContext(AppContext)

  return (
    <Slide in={!appContext.isUnlocked}>
      <LockScreenView />
    </Slide>
  )
}

export const LockScreenView = React.forwardRef((props, ref) => {
  const appContext = useContext(AppContext)

  return (
    <div className={classes.LockScreen} ref={ref as any} {...props}>
      <Stack direction={"column"} className={classes.LeftColumn}>
        <Stack direction={"column"} className={classes.WidgetPanel} id={"lockScreenWidgetPortal"}>

        </Stack>

        <Stack direction={"row"} className={classes.IconBar} id={"lockScreenIconPortal"} />
      </Stack>
      <Stack direction={"column"} className={classes.RightColumn}>
        <UnlockKeyPad />
      </Stack>
    </div>
  )
})