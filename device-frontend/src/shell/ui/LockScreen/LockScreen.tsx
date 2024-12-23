import { Slide, Stack } from "@mui/material"
import { AppContext } from "@src/shell/state/ShellState.tsx"
import { UnlockWidget } from "@src/shell/ui/LockScreen/components/UnlockKeyPad.tsx"
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
        <Stack direction={"column"} className={classes.WidgetPanel} id={"lockScreenWidgetPortal-1"}>

        </Stack>

        <Stack direction={"row"} className={classes.IconBar} id={"lockScreenIconPortal"} />
      </Stack>
      <Stack direction={"column"} className={classes.MiddleColumn}>
        <Stack direction={"column"} className={classes.WidgetPanel} id={"lockScreenWidgetPortal-2"}>

        </Stack>
      </Stack>
      <Stack direction={"column"} className={classes.RightColumn}>
        <UnlockWidget />
      </Stack>
    </div>
  )
})