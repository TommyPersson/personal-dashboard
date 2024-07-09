import { AppsOutlined } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { RunDeckAppState } from "@src/apps/run-deck/state/RunDeckAppState.ts"
import { AppBarIconPortal } from "@src/common/components/AppBarIconPortal/AppBarIconPortal.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const RunDeckAppBarIcon = (props: { state: RunDeckAppState }) => {
  const { state } = props

  const handleClick = useScrollIntoView("runDeckAppWidget")

  return (
    <AppBarIconPortal appIconId={"run-deck"} order={700}>
      <IconButton size={"large"} onClick={handleClick}>
          <AppsOutlined />
      </IconButton>
    </AppBarIconPortal>
  )
}