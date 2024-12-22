import { Alert, Box, IconProps, Stack, Typography } from "@mui/material"
import classNames from "classnames"
import React, { useMemo } from "react"
import classes from "./AppWidget.module.scss"

export const AppWidget = (props: {
  id?: string
  className?: string
  style?: React.CSSProperties
  error?: Error | null
  children: any
}) => {
  const className = classNames(props.className, classes.AppWidget)

  return (
    <div style={props.style} className={className} id={props.id}>
      <AppWidgetErrorOverlay error={props.error} />
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

export const AppWidgetErrorOverlay = (props: {
  error?: Error | null
})=> {
  if (!props.error) {
    return null
  }

  return (
    <div className={classes.AppWidgetErrorOverlay}>
      <Alert severity={"error"}>{props.error.message}</Alert>
    </div>
  )
}