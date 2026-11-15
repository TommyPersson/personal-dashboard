import { Box, Divider, Stack } from "@mui/material"
import { allAppWidgetProviders } from "@src/apps/AllAppWidgetProviders.ts"
import { ClockAppBarWidget } from "@src/apps/clock/ui/ClockAppBarWidget.tsx"
import { NotificationsAppWidget } from "@src/apps/notifications/ui/NotificationsAppWidget.tsx"
import { CommandButton } from "@src/common/components/CommandButton/CommandButton.tsx"
import { LockDeviceCommand } from "@src/shell/commands/LockDeviceCommand.ts"
import { LayoutQuery } from "@src/shell/queries/LayoutQuery.ts"
import { useQuery } from "@tanstack/react-query"
import React from "react"

import "../../infrastructure/Timer"

import classes from "./ShellScreen.module.scss"

export const ShellScreen = () => {
  const layout = useQuery(LayoutQuery)

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
          {layout.data?.apps.map(it => <React.Fragment key={it.id}>{it.factory()}</React.Fragment>)}
        </Stack>
      </div>
      <div className={classes.AppBarSlot}>
        <CommandButton command={LockDeviceCommand} iconOnly size={"large"} />
        <Box sx={{ flex: 1 }} />
        <div id={"appBarPortal"} className={classes.AppBarPortal}></div>
        <Divider />
        <ClockAppBarWidget />
      </div>
    </div>
  )
}