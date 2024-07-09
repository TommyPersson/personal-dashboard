import { Portal } from "@mui/material"
import { useEffect, useState } from "react"

export const AppBarIconPortal = (props: { children: any, appIconId: string, order: number }) => {
  const { children, appIconId, order } = props

  const [iconContainer, setIconContainer] = useState<HTMLDivElement | null>(null)

  const appBarContainer = document.getElementById("appBarPortal")

  useEffect(() => {
    const element = iconContainer
    if (iconContainer) {
      appBarContainer?.appendChild(iconContainer)
    }

    return () => {
      if (element) {
        appBarContainer?.removeChild(element)
      }
    }
  }, [appBarContainer, iconContainer, setIconContainer])

  if (!appBarContainer) {
    return null
  }

  if (!iconContainer) {
    const htmlDivElement = document.createElement("div")
    htmlDivElement.style.cssText = `order: ${order}`
    setIconContainer(htmlDivElement)
    return null
  }

  return (
    <Portal container={iconContainer}>
      {children}
    </Portal>
  )
}