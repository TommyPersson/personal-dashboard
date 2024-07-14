import { useGoogleCalendarState } from "@src/apps/google/state/GoogleCalendarAppState.ts"
import { GoogleCalendarAppWidget } from "@src/apps/google/ui/GoogleCalendarAppWidget.tsx"
import { GoogleCalendarLockScreenWidget } from "@src/apps/google/ui/GoogleCalendarLockScreenWidget.tsx"

export const GoogleAppUI = () => {
  const state = useGoogleCalendarState()

  return (
    <>
      <GoogleCalendarAppWidget state={state} />
      <GoogleCalendarLockScreenWidget state={state} />
    </>
  )
}