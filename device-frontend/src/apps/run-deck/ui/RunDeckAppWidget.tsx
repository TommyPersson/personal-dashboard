import { AppsOutlined, KeyboardOutlined } from "@mui/icons-material"
import { Button, Card, CardContent, Divider, ListItemText, MenuItem, MenuList, Stack, Typography } from "@mui/material"
import { PerformHotKeyAction } from "@src/apps/hot-keys/actions"
import { HotKeysDataEntity } from "@src/apps/hot-keys/entities/HotKeysDataEntity.ts"
import { RunItemActionAction } from "@src/apps/run-deck/actions"
import { Item, Section } from "@src/apps/run-deck/models/RunDeckData.ts"
import { RunDeckDataEntity } from "@src/apps/run-deck/entities/RunDeckDataEntity.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useAction } from "@src/infrastructure/framework/entities/useAction.tsx"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import React, { useCallback, useMemo, useState } from "react"

import classes from "./RunDeckAppWidget.module.scss"


export const RunDeckAppWidget = () => {

  const state = useRunDeckState()

  const content = state.sections.length > 0 ? (
    state.sections.map(section => (
      <div key={section.name}>
        <Stack spacing={1}>
          <Typography variant={"caption"}>{section.name}</Typography>
          {section.rows.map((row, i) => (
            <Stack direction={"row"} spacing={1} key={`${section.name}-${i}`}>
              {row.items.map(item => (
                <RunDeckItemButton key={item.id} item={item} runItemAction={state.runItemAction} />
              ))}
            </Stack>
          ))}
        </Stack>
      </div>
    ))
  ) : (
    <Typography
      color={"text.secondary"}
      children={"No Run Deck configured"}
      textAlign={"center"}
    />
  )

  return (
    <AppWidget className={classes.RunDeckAppWidget}>
      <Stack spacing={2}>
        <AppWidgetHeader
          title={"Run Deck"}
          icon={<AppsOutlined />}
        />
        {content}
      </Stack>
    </AppWidget>
  )
}

const RunDeckItemButton = (props: { item: Item, runItemAction: (item: Item) => void }) => {
  const { item, runItemAction } = props

  const [hideImage, setHideImage] = useState(false)
  const onlyText = hideImage

  const handleImageError = useCallback(() => {
    setHideImage(true)
  }, [setHideImage])

  const handleClick = useCallback(() => {
    runItemAction(item)
  }, [item, runItemAction])

  const imgSrc = `/api/apps/run-deck/items/${item.id}/icon`

  return (
    <Button
      variant={"contained"}
      color={"success"}
      className={classes.ItemButton}
      onClick={handleClick}
    >
      <div className={classes.ItemImageContainer}>
        {!hideImage && <img src={imgSrc} alt={`${item.text} icon`} onError={handleImageError} />}
      </div>
      <span className={classes.ItemText} children={item.text} />
    </Button>
  )
}


type RunDeckState = {
  sections: Section[]
  runItemAction: (item: Item) => void
}

const EmptyArray: any[] = []

function useRunDeckState(): RunDeckState {
  const entity = useEntity(RunDeckDataEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  const runItemActionAction = useAction(RunItemActionAction)

  useInterval(entity.fetchAsync, 5000)

  const sections = entity.value?.sections ?? EmptyArray

  const runItemAction = useCallback((item: Item) => {
    runItemActionAction.executeAsync({ itemId: item.id })
  }, [runItemActionAction])


  return useMemo(() => ({
    sections,
    runItemAction: runItemAction,
  }), [sections, runItemAction])
}
