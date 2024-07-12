import { DynamicPortal } from "@src/common/components/DynamicPortal/DynamicPortal.tsx"

export const LockScreenIconPortal = (props: { children: any, id: string, order: number }) => {
  return (
    <DynamicPortal
      targetId={"lockScreenIconPortal"}
      id={props.id}
      order={props.order}
      children={props.children}
    />
  )
}