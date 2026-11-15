import { PomodoroDurationSeconds, PomodoroTimerAppState } from "@src/apps/pomodoro-timer/state/PomodoroTimerAppState.ts"
import { Duration } from "luxon"
import { fn } from "storybook/test"

export function pomodoroState(remainingSeconds: number, isRunning: boolean): PomodoroTimerAppState {
  return {
    isRunning,
    remainingSeconds,
    remainingTime: Duration.fromObject({ seconds: remainingSeconds }),
    percentRemaining: (remainingSeconds / PomodoroDurationSeconds) * 100,
    startOrResume: fn(),
    pause: fn(),
    reset: fn(),
  }
}
