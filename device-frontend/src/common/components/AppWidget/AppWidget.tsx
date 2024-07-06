import { Box, IconProps, Stack, Typography } from "@mui/material"
import classNames from "classnames"
import React, { useMemo } from "react"
import classes from "./AppWidget.module.scss"

export const AppWidget = (props: {
  className?: string
  style?: React.CSSProperties
  children: any
}) => {
  const className = classNames(props.className, classes.AppWidget)

  return (
    <div style={props.style} className={className}>
      {props.children}
    </div>
  )
}

export const AppWidgetHeader = (props: {
  title?: string
  icon?: React.ReactElement<IconProps>
  rightContent?: any
}) => {
  const { title, icon, rightContent } = props

  return (
    <Stack
      direction={"row"}
      spacing={1}
      sx={{ whiteSpace: "nowrap", height: 40 }}
      alignItems={"center"}
      className={classes.AppWidgetHeader}
    >
      {icon}
      {title && <Typography variant={"overline"} component={"h1"}>{title}</Typography>}
      {rightContent && <><Box sx={{ flex: 1 }} />{rightContent}</>}
    </Stack>
  )
}