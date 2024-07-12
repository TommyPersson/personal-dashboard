import { DynamicPortal } from "@src/common/components/DynamicPortal/DynamicPortal.tsx"

export const LockScreenWidgetPortal = (props: { children: any, id: string, order: number }) => {
  return (
    <DynamicPortal
      targetId={"lockScreenWidgetPortal"}
      id={props.id}
      order={props.order}
      children={props.children}
    />
  )
}