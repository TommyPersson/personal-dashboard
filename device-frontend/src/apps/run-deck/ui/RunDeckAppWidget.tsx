import { AppsOutlined } from "@mui/icons-material"
import { Button, Stack, Typography } from "@mui/material"
import { RunItemActionCommand } from "@src/apps/run-deck/commands/RunItemActionCommand.ts"
import { Item } from "@src/apps/run-deck/models/RunDeckData.ts"
import { RunDeckAppState } from "@src/apps/run-deck/state/RunDeckAppState.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { CommandErrorPopover } from "@src/common/components/CommandError/CommandError.tsx"
import { useCommand } from "@src/infrastructure/framework/commands/useCommand.ts"
import React, { useCallback, useRef, useState } from "react"

import classes from "./RunDeckAppWidget.module.scss"

export const RunDeckAppWidget = React.memo((props: { state: RunDeckAppState }) => {
  const { state } = props

  const content = state.sections.length > 0 ? (
    state.sections.map(section => (
      <div key={section.name}>
        <Stack spacing={1}>
          <Typography variant={"caption"}>{section.name}</Typography>
          {section.rows.map((row, i) => (
            <Stack direction={"row"} spacing={1} key={`${section.name}-${i}`}>
              {row.items.map(item => (
                <RunDeckItemButton key={item.id} item={item} />
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
      sx={{ textAlign: "center" }}
    />
  )

  return (
    <>
      <AppWidget className={classes.RunDeckAppWidget} id={"runDeckAppWidget"}>
        <Stack spacing={2}>
          <AppWidgetHeader
            title={"Run Deck"}
            icon={<AppsOutlined />}
          />
          {content}
        </Stack>
      </AppWidget>
    </>
  )
})

/** A tile rather than a `CommandButton`, as it shows the item's image. */
const RunDeckItemButton = (props: { item: Item }) => {
  const { item } = props

  const runItemAction = useCommand(RunItemActionCommand)
  const { execute } = runItemAction
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const [hideImage, setHideImage] = useState(false)

  const handleImageError = useCallback(() => {
    setHideImage(true)
  }, [setHideImage])

  const handleClick = useCallback(() => {
    execute({ itemId: item.id })
  }, [execute, item.id])

  const imgSrc = `/api/apps/run-deck/items/${item.id}/icon`

  return (
    <>
      <Button
        ref={buttonRef}
        variant={"contained"}
        color={"success"}
        className={classes.ItemButton}
        onClick={handleClick}
        loading={runItemAction.isPending}
      >
        <div className={classes.ItemImageContainer}>
          {!hideImage && <img src={imgSrc} alt={`${item.text} icon`} onError={handleImageError} />}
        </div>
        <span className={classes.ItemText} children={item.text} />
      </Button>
      <CommandErrorPopover state={runItemAction} anchorEl={buttonRef.current} />
    </>
  )
}
