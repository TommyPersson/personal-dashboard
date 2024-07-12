import { Badge, BadgeProps, IconButton } from "@mui/material"
import { LockScreenIconPortal } from "@src/common/components/LockScreenIconPortal/LockScreenIconPortal.tsx"
import React from "react"

export const LockScreenIcon = (props: {
  id: string
  order: number
  icon: any
  badgeProps?: BadgeProps
}) => {
  return (
    <LockScreenIconPortal id={props.id} order={props.order}>
      <IconButton size={"large"} color={"inherit"}>
        <Badge {...props.badgeProps}>
          {props.icon}
        </Badge>
      </IconButton>
    </LockScreenIconPortal>
  )
}