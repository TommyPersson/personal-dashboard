import { DynamicPortal } from "@src/common/components/DynamicPortal/DynamicPortal.tsx"

export const AppBarIconPortal = (props: { children: any, id: string, order: number }) => {
  return (
    <DynamicPortal
      targetId={"appBarPortal"}
      id={props.id}
      order={props.order}
      children={props.children}
    />
  )
}