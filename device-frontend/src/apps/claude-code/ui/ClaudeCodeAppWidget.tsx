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
  CardActionArea,
  CardContent,
  CircularProgress,
  Collapse,
  IconButton,
  LinearProgress,
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
            <SessionCard
              key={it.id}
              session={it}
              onDiscard={() => state.discard(it)}
              onOpenOnWorkstation={() => state.openOnWorkstation(it)}
            />
          ))
        ) : (
          <EmptyState icon={<SmartToyOutlined />} description={"No active sessions"} />
        )}
      </Stack>
    </AppWidget>
  )
})

const SessionCard = (props: { session: ClaudeSession, onDiscard: () => void, onOpenOnWorkstation: () => void }) => {
  const { session, onDiscard, onOpenOnWorkstation } = props
  const [expanded, setExpanded] = useState(true)

  const handleBodyClicked = session.canOpenOnWorkstation ? onOpenOnWorkstation : undefined
  const handleDiscardClicked = useCallback((e: React.MouseEvent<any>) => {
    e.stopPropagation()
    onDiscard()
  }, [onDiscard])

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
            {formatTime(session.updatedAt)}
          </Typography>
          <IconButton
            onClick={handleDiscardClicked}
            aria-label={"Discard session"}
            edge={"end"}
          >
            <CloseOutlined />
          </IconButton>
        </Stack>

        {session.status !== "Idle" && (
          <LinearProgress
            sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            color={session.status === "Working" ? "primary" : "warning"}
          />
        )}
      </CardContent>

      <Collapse in={expanded}>
        <SessionCardBody onClick={handleBodyClicked}>
          <Stack spacing={1}>
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
              {session.currentActivity && <CurrentActivityIndicator session={session} />}
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
  children: React.ReactNode
}) => {
  const content = (
    <CardContent sx={{ pt: 0, pb: 2 }}>{props.children}</CardContent>
  )

  if (!props.onClick) {
    return content
  }

  return (
    <CardActionArea component={"div"} onClick={props.onClick} aria-label={"Open session on the PC"}>
      {content}
    </CardActionArea>
  )
}

const CurrentActivityIndicator = (props: { session: ClaudeSession }) => {
  return (
    <>
      <CircularProgress size={14} />
      <Typography variant={"caption"} color={"text.secondary"} noWrap>
        {props.session.currentActivity}
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
  const end = !promptEndedAt ? now : new Date(promptEndedAt).getTime()
  const elapsedMs = end - new Date(session.promptStartedAt).getTime()

  return (
    <Stack direction={"row"} spacing={0.5} sx={{ alignItems: "center", color: "text.secondary" }}>
      <TimerOutlined fontSize={"small"} />
      <Typography variant={"caption"} className={classes.RunTime}>{formatDuration(elapsedMs)}</Typography>
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
