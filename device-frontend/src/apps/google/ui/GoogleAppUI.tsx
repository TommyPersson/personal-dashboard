import { useGoogleCalendarState } from "@src/apps/google/state/GoogleCalendarAppState.ts"
import { GoogleCalendarAppWidget } from "@src/apps/google/ui/GoogleCalendarAppWidget.tsx"

export const GoogleAppUI = () => {
  const state = useGoogleCalendarState()

  return (
    <>
      <GoogleCalendarAppWidget state={state} />
    </>
  )
}