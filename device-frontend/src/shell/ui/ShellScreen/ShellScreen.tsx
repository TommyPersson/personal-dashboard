import { Lock } from "@mui/icons-material"
import { Box, Divider, IconButton, Stack } from "@mui/material"
import { allAppWidgetProviders } from "@src/apps/AllAppWidgetProviders.ts"
import { ClockAppBarWidget } from "@src/apps/clock/ui/ClockAppBarWidget.tsx"
import { NotificationsAppWidget } from "@src/apps/notifications/ui/NotificationsAppWidget.tsx"
import { useEntity } from "@src/infrastructure/framework/entities"
import { LayoutEntity } from "@src/shell/entities"
import { AppContext } from "@src/shell/state/ShellState.tsx"
import React, { useContext } from "react"

import "../../infrastructure/Timer"

import classes from "./ShellScreen.module.scss"

export const ShellScreen = () => {
  const appContext = useContext(AppContext)
  const layout = useEntity(LayoutEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  return (
    <div className={classes.ShellScreen}>
      <div className={classes.StatusBarSlot}></div>
      <div className={classes.NotificationAreaSlot}>
        <NotificationsAppWidget />
      </div>
      <div id={"appAreaPortal"} className={classes.AppAreaPortal} />
      <div className={classes.AppAreaSlot}>
        <Stack
          direction={"row"}
          spacing={0}
        >
          {layout.value?.apps?.map(it => <React.Fragment key={it.id}>{it.factory()}</React.Fragment>)}
        </Stack>
      </div>
      <div className={classes.AppBarSlot}>
        <IconButton size={"large"} onClick={appContext.lock}>
          <Lock />
        </IconButton>
        <Box flex={1} />
        <div id={"appBarPortal"} className={classes.AppBarPortal}></div>
        <Divider />
        <ClockAppBarWidget />
      </div>
    </div>
  )
}