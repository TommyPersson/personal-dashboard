import { KeyboardOutlined } from "@mui/icons-material"
import { List, ListItemButton, ListItemText, ListSubheader, Paper, Stack, Typography } from "@mui/material"
import { HotKey } from "@src/apps/hot-keys/models/HotKeysData.ts"
import { HotKeysAppState, useHotKeysAppState } from "@src/apps/hot-keys/state/HotKeysAppState.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import React, { useCallback } from "react"

import classes from "./HotKeysAppWidget.module.scss"


export const HotKeysAppWidget = () => {

  const state = useHotKeysAppState()

  const content = state.sections.length > 0 ? (
    state.sections.map(section => (
      <List key={section.name} component={Paper}>
        <ListSubheader>{section.name}</ListSubheader>
        {section.hotKeys.map(hotKey =>
          <HotKeyMenuItem key={hotKey.name} state={state} hotKey={hotKey} />,
        )}
      </List>
    ))
  ) : (
    <Typography
      color={"text.secondary"}
      children={"No hot-keys configured for current application"}
      textAlign={"center"}
    />
  )

  return (
    <AppWidget className={classes.HotKeysAppWidget}>
      <Stack spacing={2}>
        <AppWidgetHeader
          title={"Hot Keys"}
          icon={<KeyboardOutlined />}
        />
        {content}
      </Stack>
    </AppWidget>
  )
}


const HotKeyMenuItem = (props: { state: HotKeysAppState, hotKey: HotKey }) => {
  const { state, hotKey } = props

  const execute = useCallback(() => {
    state.execute(hotKey)
  }, [hotKey, state])

  return (
    <>
      <ListItemButton onClick={execute} divider={true}>
        <ListItemText>{hotKey.name}</ListItemText>
        <Typography variant={"body2"} color={"text.secondary"}>{hotKey.keys}</Typography>
      </ListItemButton>
    </>
  )
}