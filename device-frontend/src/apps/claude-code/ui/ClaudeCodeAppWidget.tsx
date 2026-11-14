import {
  CheckCircleOutlined,
  CloseOutlined,
  RadioButtonUncheckedOutlined,
  SmartToyOutlined,
  TimerOutlined,
} from "@mui/icons-material"
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material"
import { ClaudePlanItem, ClaudeSession } from "@src/apps/claude-code/models/ClaudeSession.ts"
import { ClaudeCodeAppState } from "@src/apps/claude-code/state/ClaudeCodeAppState.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { EmptyState } from "@src/common/components/EmptyState/EmptyState.tsx"
import React, { useEffect, useState } from "react"

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
            <Button
              onClick={state.discardAll}
              disabled={state.sessions.length === 0}
              startIcon={<CloseOutlined />}
              children={"Clear"}
            />
          }
        />
        {state.sessions.length > 0 ? (
          state.sessions.map(it => (
            <SessionCard key={it.id} session={it} onDiscard={() => state.discard(it)} />
          ))
        ) : (
          <EmptyState icon={<SmartToyOutlined />} description={"No active sessions"} />
        )}
      </Stack>
    </AppWidget>
  )
})

const SessionCard = (props: { session: ClaudeSession, onDiscard: () => void }) => {
  const { session, onDiscard } = props
  const [expanded, setExpanded] = useState(true)

  return (
    <Card variant={"outlined"} className={classes.SessionCard}>
      <CardContent>
        <Stack>
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
            <StatusChip session={session} />
            <RunTime session={session} />
            <Typography variant={"caption"} color={"text.secondary"} sx={{ flex: 1, textAlign: "right" }}>
              {formatTime(session.updatedAt)}
            </Typography>
            <IconButton
              onClick={e => {
                e.stopPropagation()
                onDiscard()
              }}
              aria-label={"Discard session"}
              edge={"end"}
            >
              <CloseOutlined />
            </IconButton>
          </Stack>

          <Collapse in={expanded}>
            <Stack spacing={1} sx={{ pt: 1 }}>
              {session.prompt && (
                <Typography variant={"body2"} className={classes.Prompt}>{session.prompt}</Typography>
              )}

              {session.status === "WaitingForInput" && (
                <Alert severity={"warning"} variant={"filled"}>
                  <strong>Waiting for response</strong>
                  {session.waitingFor && <><br />{session.waitingFor}</>}
                </Alert>
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

              {session.currentActivity && (
                <Stack direction={"row"} spacing={1} sx={{ alignItems: "center" }}>
                  <CircularProgress size={14} />
                  <Typography variant={"caption"} color={"text.secondary"} noWrap>{session.currentActivity}</Typography>
                </Stack>
              )}
            </Stack>
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  )
}

const StatusChip = (props: { session: ClaudeSession }) => {
  switch (props.session.status) {
    case "Working":
      return <Chip size={"small"} color={"primary"} label={"Working"} />
    case "WaitingForInput":
      return <Chip size={"small"} color={"warning"} label={"Waiting"} />
    case "Idle":
      return <Chip size={"small"} label={"Done"} />
  }
}

/** How long Claude has been on the latest prompt: ticking while it works, frozen once its turn has ended. */
const RunTime = (props: { session: ClaudeSession }) => {
  const { session } = props
  const isRunning = session.status !== "Idle"
  const now = useNow(isRunning ? 1_000 : null)

  if (!session.promptStartedAt) {
    return null
  }

  // The turn can resume without a new prompt (e.g. a background task finishing), so trust the status over the end time.
  const end = isRunning || !session.promptEndedAt ? now : new Date(session.promptEndedAt).getTime()
  const elapsedMs = end - new Date(session.promptStartedAt).getTime()

  return (
    <Stack direction={"row"} spacing={0.5} sx={{ alignItems: "center", color: "text.secondary" }}>
      <TimerOutlined fontSize={"small"} />
      <Typography variant={"caption"} className={classes.RunTime}>{formatDuration(elapsedMs)}</Typography>
    </Stack>
  )
}

/** The current time, re-rendering every [intervalMs] (or not at all when `null`). */
function useNow(intervalMs: number | null) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    setNow(Date.now())
    if (intervalMs === null) {
      return
    }
    const handle = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(handle)
  }, [intervalMs])

  return now
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

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })
}

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor(totalSeconds / 60) % 60
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`
  }
  return `${seconds}s`
}
