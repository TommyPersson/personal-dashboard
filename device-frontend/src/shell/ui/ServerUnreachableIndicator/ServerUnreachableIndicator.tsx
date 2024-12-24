import { Alert, Fade } from "@mui/material"
import { AppContext } from "@src/shell/state/ShellState.tsx"
import { useContext } from "react"

import classes from "./ServerUnreachableIndicator.module.scss"

export const ServerUnreachableIndicator = (props: {
}) => {
  const appContext = useContext(AppContext)

  return (
    <Fade in={!appContext.isServerReachable}>
      <Alert severity={"error"} variant={"filled"} className={classes.ServerUnreachableIndicator}>
        Server unreachable
      </Alert>
    </Fade>
  )
}