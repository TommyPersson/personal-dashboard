import { KeyboardOutlined } from "@mui/icons-material"
import { List, ListItemButton, ListItemText, ListSubheader, Paper, Stack, Typography } from "@mui/material"
import { PerformHotKeyAction } from "@src/apps/hot-keys/actions"
import { HotKeysDataEntity } from "@src/apps/hot-keys/entities/HotKeysDataEntity.ts"
import { HotKey, HotKeySection } from "@src/apps/hot-keys/models/HotKeysData.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useAction } from "@src/infrastructure/framework/entities/useAction.tsx"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import React, { useCallback, useMemo } from "react"

import classes from "./HotKeysAppWidget.module.scss"


export const HotKeysAppWidget = () => {

  const state = useHotKeysState()

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


const HotKeyMenuItem = (props: { state: HotKeysState, hotKey: HotKey }) => {
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

type HotKeysState = {
  sections: HotKeySection[]
  execute: (hotKey: HotKey) => void
}


function useHotKeysState(): HotKeysState {
  const entity = useEntity(HotKeysDataEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  const sendKeysAction = useAction(PerformHotKeyAction)

  useInterval(entity.fetchAsync, 5000)

  const sections = entity.value?.sections ?? EmptyArray

  const execute = useCallback((hotKey: HotKey) => {
    sendKeysAction.executeAsync({ hotKeyId: hotKey.id })
  }, [sendKeysAction])

  return useMemo(() => ({
    sections,
    execute,
  }), [sections, execute])
}