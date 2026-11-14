import { PomodoroDurationSeconds, PomodoroTimerAppState } from "@src/apps/pomodoro-timer/state/PomodoroTimerAppState.ts"
import { fn } from "storybook/test"

export function pomodoroState(remainingSeconds: number, isRunning: boolean): PomodoroTimerAppState {
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, "0")
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0")
  return {
    isRunning,
    remainingSeconds,
    remainingTimeText: `${minutes}:${seconds}`,
    percentRemaining: (remainingSeconds / PomodoroDurationSeconds) * 100,
    startOrResume: fn(),
    pause: fn(),
    reset: fn(),
  }
}
