import { Portal } from "@mui/material"
import { useEffect, useState } from "react"

type DynamicPortalProps = {
  children: any
  targetId: string
  id: string
  order: number
}

export const DynamicPortal = (props: DynamicPortalProps) => {
  const { children, targetId, id, order } = props

  const [elementContainer, setElementContainer] = useState<HTMLDivElement | null>(null)

  const portalContainer = document.getElementById(targetId)

  useEffect(() => {
    const element = elementContainer
    if (elementContainer) {
      portalContainer?.appendChild(elementContainer)
    }

    return () => {
      if (element) {
        portalContainer?.removeChild(element)
      }
    }
  }, [portalContainer, elementContainer, setElementContainer])

  if (!portalContainer) {
    return null
  }

  if (!elementContainer) {
    const htmlDivElement = document.createElement("div")
    htmlDivElement.style.cssText = `order: ${order}`
    setElementContainer(htmlDivElement)
    return null
  }

  return (
    <Portal container={elementContainer}>
      {children}
    </Portal>
  )
}