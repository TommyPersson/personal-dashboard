import { CalendarAppUI } from "@src/apps/calendar/ui/CalendarAppUI.tsx"
import { AppWidgetProvider } from "@src/common/AppWidgetProvider.ts"
import React from "react"

export const calendarAppWidgetProvider: AppWidgetProvider = {
  id: "calendar-app",
  title: "Calendar",
  factory: () => <CalendarAppUI />,
}