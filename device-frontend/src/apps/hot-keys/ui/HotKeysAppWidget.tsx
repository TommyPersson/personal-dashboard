import { KeyboardOutlined } from "@mui/icons-material"
import { List, ListItemButton, ListItemText, ListSubheader, Paper, Stack, Typography } from "@mui/material"
import { PerformHotKeyCommand } from "@src/apps/hot-keys/commands/PerformHotKeyCommand.ts"
import { HotKey } from "@src/apps/hot-keys/models/HotKeysData.ts"
import { HotKeysAppState } from "@src/apps/hot-keys/state/HotKeysAppState.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { CommandErrorAlert } from "@src/common/components/CommandError/CommandError.tsx"
import { useCommand } from "@src/infrastructure/framework/commands/useCommand.ts"
import React, { useCallback } from "react"

import classes from "./HotKeysAppWidget.module.scss"


export const HotKeysAppWidget = React.memo((props: { state: HotKeysAppState }) => {
  const { state } = props

  const content = state.sections.length > 0 ? (
    state.sections.map(section => (
      <List key={section.name} component={Paper}>
        <ListSubheader disableSticky>{section.name}</ListSubheader>
        {section.hotKeys.map(hotKey =>
          <HotKeyMenuItem key={hotKey.name} hotKey={hotKey} />,
        )}
      </List>
    ))
  ) : (
    <Typography
      color={"text.secondary"}
      children={"No hot-keys configured for current application"}
      sx={{ textAlign: "center" }}
    />
  )

  return (
    <AppWidget className={classes.HotKeysAppWidget} id={"hotKeysAppWidget"}>
      <Stack spacing={2}>
        <AppWidgetHeader
          title={"Hot Keys"}
          icon={<KeyboardOutlined />}
        />
        {content}
      </Stack>
    </AppWidget>
  )
})

const HotKeyMenuItem = (props: { hotKey: HotKey }) => {
  const { hotKey } = props

  const performHotKey = useCommand(PerformHotKeyCommand)
  const { execute } = performHotKey

  const handleClick = useCallback(() => {
    execute({ hotKeyId: hotKey.id })
  }, [execute, hotKey.id])

  return (
    <>
      <ListItemButton onClick={handleClick} disabled={performHotKey.isPending} divider={true}>
        <ListItemText>{hotKey.name}</ListItemText>
        <Typography variant={"body2"} color={"text.secondary"}>{hotKey.keys}</Typography>
      </ListItemButton>
      <CommandErrorAlert state={performHotKey} square />
    </>
  )
}