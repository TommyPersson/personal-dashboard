import { Portal } from "@mui/material"

export const AppAreaOverlayPortal = (props: { children: any }) => {
  const container = document.getElementById("appAreaPortal")

  return (
    <Portal container={container}>
      {props.children}
    </Portal>
  )
}