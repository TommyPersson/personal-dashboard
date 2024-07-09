import { AppsOutlined } from "@mui/icons-material"
import { RunDeckAppState } from "@src/apps/run-deck/state/RunDeckAppState.ts"
import { AppBarIcon } from "@src/common/components/AppBarIcon/AppBarIcon.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const RunDeckAppBarIcon = (props: { state: RunDeckAppState }) => {
  const { state } = props

  const handleClick = useScrollIntoView("runDeckAppWidget")

  return (
    <AppBarIcon
      id={"run-deck"}
      order={700}
      icon={<AppsOutlined />}
      onClick={handleClick}
    />
  )
}