import { DynamicPortal } from "@src/common/components/DynamicPortal/DynamicPortal.tsx"

export const LockScreenWidgetPortal = (props: { children: any, id: string, order: number, column: number }) => {
  return (
    <DynamicPortal
      targetId={`lockScreenWidgetPortal-${props.column}`}
      id={props.id}
      order={props.order}
      children={props.children}
    />
  )
}