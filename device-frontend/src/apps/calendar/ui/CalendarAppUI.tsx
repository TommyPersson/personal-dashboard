import { useCalendarState } from "@src/apps/calendar/state/CalendarAppState.ts"
import { CalendarAppWidget } from "@src/apps/calendar/ui/CalendarAppWidget.tsx"
import { CalendarLockScreenWidget } from "@src/apps/calendar/ui/CalendarLockScreenWidget.tsx"

export const CalendarAppUI = () => {
  const state = useCalendarState()

  return (
    <>
      <CalendarAppWidget state={state} />
      <CalendarLockScreenWidget state={state} />
    </>
  )
}