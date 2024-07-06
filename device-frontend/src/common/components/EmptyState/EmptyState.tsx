import { Stack, SvgIconProps, Typography } from "@mui/material"
import React from "react"

import classes from "./EmptyState.module.scss"

export type EmptyStateProps = {
  title?: string
  description?: string
  icon?: React.ReactElement<SvgIconProps>
}

export const EmptyState = (props: EmptyStateProps) => {
  const { description, icon, title } = props

  return (
    <Stack className={classes.EmptyState} {...stackProps}>
      {icon && React.cloneElement(icon, { fontSize: "large" })}
      {title && <Typography children={title} {...titleProps} />}
      {description && <Typography children={description} {...descriptionProps} />}
    </Stack>
  )
}

const stackProps: React.ComponentProps<typeof Stack> = {
  direction: "column",
  spacing: 1,
  alignItems: "center",
  mt: 8,
  mb: 8,
}

const titleProps: React.ComponentProps<typeof Typography> = {
  variant: "h6",
  ...{ component: "p" },
}

const descriptionProps: React.ComponentProps<typeof Typography> = {
  variant: "subtitle1",
  color: "text.secondary"
}