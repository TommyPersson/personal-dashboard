import { KeyboardOutlined } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { HotKeysAppState } from "@src/apps/hot-keys/state/HotKeysAppState.ts"
import { AppBarIconPortal } from "@src/common/components/AppBarIconPortal/AppBarIconPortal.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const HotKeysAppBarIcon = (props: { state: HotKeysAppState }) => {
  const { state } = props

  const handleClick = useScrollIntoView("hotKeysAppWidget")

  return (
    <AppBarIconPortal appIconId={"hot-keys"} order={600}>
      <IconButton size={"large"} onClick={handleClick}>
        <KeyboardOutlined />
      </IconButton>
    </AppBarIconPortal>
  )
}