import React from "react"

export interface AppWidgetProvider {
  readonly id: string
  readonly title: string
  readonly factory: () => React.ReactElement,
}