import { CheckCircleOutlined, RadioButtonUncheckedOutlined, SmartToyOutlined, TimerOutlined } from "@mui/icons-material"
import {
  Alert,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Collapse,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material"
import { DiscardAllClaudeSessionsCommand } from "@src/apps/claude-code/commands/DiscardAllClaudeSessionsCommand.ts"
import { DiscardClaudeSessionCommand } from "@src/apps/claude-code/commands/DiscardClaudeSessionCommand.ts"
import { OpenClaudeSessionOnWorkstationCommand } from "@src/apps/claude-code/commands/OpenClaudeSessionOnWorkstationCommand.ts"
import { ClaudePlanItem, ClaudeSession } from "@src/apps/claude-code/models/ClaudeSession.ts"
import { ClaudeCodeAppState } from "@src/apps/claude-code/state/ClaudeCodeAppState.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { CommandButton } from "@src/common/components/CommandButton/CommandButton.tsx"
import { CommandErrorAlert } from "@src/common/components/CommandError/CommandError.tsx"
import { DateTimeText } from "@src/common/components/DateTimeText/DateTimeText.tsx"
import { DurationText } from "@src/common/components/DurationText/DurationText.tsx"
import { EmptyState } from "@src/common/components/EmptyState/EmptyState.tsx"
import { useCommand } from "@src/infrastructure/framework/commands/useCommand.ts"
import { useNow } from "@src/infrastructure/hooks/useNow"
import React, { useCallback, useState } from "react"

import classes from "./ClaudeCodeAppWidget.module.scss"

export const ClaudeCodeAppWidget = React.memo((props: { state: ClaudeCodeAppState }) => {
  const { state } = props

  return (
    <AppWidget className={classes.ClaudeCodeAppWidget} id={"claudeCodeAppWidget"} error={state.error}>
      <Stack spacing={2}>
        <AppWidgetHeader
          title={"Claude Code"}
          icon={<SmartToyOutlined />}
          rightContent={
            <CommandButton command={DiscardAllClaudeSessionsCommand} disabled={state.sessions.length === 0} />
          }
        />
        {state.sessions.length > 0 ? (
          state.sessions.map(it => <SessionCard key={it.id} session={it} />)
        ) : (
          <EmptyState icon={<SmartToyOutlined />} description={"No active sessions"} />
        )}
      </Stack>
    </AppWidget>
  )
})

const SessionCard = (props: { session: ClaudeSession }) => {
  const { session } = props
  const [expanded, setExpanded] = useState(true)

  const openOnWorkstation = useCommand(OpenClaudeSessionOnWorkstationCommand)
  const { execute: executeOpenOnWorkstation } = openOnWorkstation

  const handleBodyClicked = useCallback(() => {
    executeOpenOnWorkstation({ sessionId: session.id })
  }, [executeOpenOnWorkstation, session.id])

  return (
    <Card variant={"outlined"} className={classes.SessionCard}>
      <CardContent sx={{ pb: expanded ? 0 : undefined }}>
        <Stack
          direction={"row"}
          spacing={1}
          sx={{ alignItems: "center" }}
          className={classes.Header}
          onClick={() => setExpanded(it => !it)}
          role={"button"}
          aria-expanded={expanded}
        >
          <Typography variant={"subtitle1"} sx={{ fontWeight: 500 }} noWrap>
            {session.project ?? "Unknown project"}
          </Typography>
          <Typography variant={"caption"} color={"text.secondary"} sx={{ flex: 1, textAlign: "right" }}>
            <DateTimeText value={session.updatedAt} format={"time"} />
          </Typography>
          <CommandButton
            command={DiscardClaudeSessionCommand}
            args={{ sessionId: session.id }}
            iconOnly
            edge={"end"}
          />
        </Stack>

        {session.status !== "Idle" && (
          <LinearProgress
            sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            color={session.status === "Working" ? "primary" : "warning"}
          />
        )}
      </CardContent>

      <Collapse in={expanded}>
        <SessionCardBody
          onClick={session.canOpenOnWorkstation ? handleBodyClicked : undefined}
          aria-label={OpenClaudeSessionOnWorkstationCommand.label}
        >
          <Stack spacing={1}>
            <CommandErrorAlert state={openOnWorkstation} />

            {session.prompt && (
              <Typography variant={"body2"} className={classes.Prompt}>{session.prompt}</Typography>
            )}

            {session.plan.length > 0 && (
              <List dense disablePadding>
                {session.plan.map((it, i) => <PlanItem key={i} item={it} />)}
              </List>
            )}

            {session.status === "Idle" && session.result && (
              <Typography variant={"body2"} color={"text.secondary"} className={classes.Result}>
                {session.result}
              </Typography>
            )}

            {session.status === "WaitingForInput" && (
              <Alert severity={"warning"} variant={"filled"}>
                <strong>Waiting for response</strong>
                {session.waitingFor && <><br />{session.waitingFor}</>}
              </Alert>
            )}

            <Stack direction={"row"} spacing={1} sx={{ alignItems: "center" }}>
              {openOnWorkstation.isPending ? (
                <ActivityIndicator text={"Opening on the PC…"} />
              ) : session.currentActivity && (
                <ActivityIndicator text={session.currentActivity} />
              )}
              <div style={{ flex: 1 }} />
              <PromptDurationIndicator session={session} />
            </Stack>
          </Stack>
        </SessionCardBody>
      </Collapse>
    </Card>
  )
}

const SessionCardBody = (props: {
  onClick?: () => void,
  "aria-label": string,
  children: React.ReactNode
}) => {
  const content = (
    <CardContent sx={{ pt: 0, pb: 2 }}>{props.children}</CardContent>
  )

  if (!props.onClick) {
    return content
  }

  return (
    <CardActionArea component={"div"} onClick={props.onClick} aria-label={props["aria-label"]}>
      {content}
    </CardActionArea>
  )
}

const ActivityIndicator = (props: { text: string }) => {
  return (
    <>
      <CircularProgress size={14} />
      <Typography variant={"caption"} color={"text.secondary"} noWrap>
        {props.text}
      </Typography>
    </>
  )
}

const PromptDurationIndicator = (props: { session: ClaudeSession }) => {
  const { session } = props
  const isRunning = session.status !== "Idle"
  const now = useNow()

  if (!session.promptStartedAt) {
    return null
  }

  // The turn can resume without a new prompt (e.g. a background task finishing), so trust the status over the end time.
  const promptEndedAt = !isRunning ? session.promptEndedAt : null
  const end = promptEndedAt ?? now
  const elapsed = end.diff(session.promptStartedAt)

  return (
    <Stack direction={"row"} spacing={0.5} sx={{ alignItems: "center", color: "text.secondary" }}>
      <TimerOutlined fontSize={"small"} />
      <Typography variant={"caption"} className={classes.RunTime}><DurationText value={elapsed} /></Typography>
    </Stack>
  )
}

const PlanItem = (props: { item: ClaudePlanItem }) => {
  const { item } = props

  return (
    <ListItem disableGutters>
      <ListItemIcon className={classes.PlanItemIcon}>{getPlanItemIcon(item)}</ListItemIcon>
      <ListItemText
        primary={item.content}
        slotProps={{ primary: { color: item.status === "Completed" ? "text.secondary" : "text.primary" } }}
      />
    </ListItem>
  )
}

function getPlanItemIcon(item: ClaudePlanItem) {
  switch (item.status) {
    case "Completed":
      return <CheckCircleOutlined color={"success"} fontSize={"small"} />
    case "InProgress":
      return <CircularProgress size={16} />
    case "Pending":
      return <RadioButtonUncheckedOutlined color={"disabled"} fontSize={"small"} />
  }
}
