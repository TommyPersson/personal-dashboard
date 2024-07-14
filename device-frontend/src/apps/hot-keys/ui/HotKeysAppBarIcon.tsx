import { KeyboardOutlined } from "@mui/icons-material"
import { HotKeysAppState } from "@src/apps/hot-keys/state/HotKeysAppState.ts"
import { AppBarIcon } from "@src/common/components/AppBarIcon/AppBarIcon.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const HotKeysAppBarIcon = React.memo((props: { state: HotKeysAppState }) => {
  const { state } = props

  const handleClick = useScrollIntoView("hotKeysAppWidget")

  return (
    <AppBarIcon
      id={"hot-keys"}
      order={600}
      icon={<KeyboardOutlined />}
      onClick={handleClick}
    />
  )
})