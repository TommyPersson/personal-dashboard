import { Badge, BadgeProps, IconButton } from "@mui/material"
import { AppBarIconPortal } from "@src/common/components/AppBarIconPortal/AppBarIconPortal.tsx"
import React from "react"

export const AppBarIcon = (props: {
  id: string
  order: number
  icon: any
  badgeProps?: BadgeProps
  onClick?: () => void
}) => {
  return (
    <AppBarIconPortal id={props.id} order={props.order}>
      <IconButton size={"large"} onClick={props.onClick}>
        <Badge {...props.badgeProps}>
          {props.icon}
        </Badge>
      </IconButton>
    </AppBarIconPortal>
  )
}