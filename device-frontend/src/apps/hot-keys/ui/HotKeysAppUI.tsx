import { useHotKeysAppState } from "@src/apps/hot-keys/state/HotKeysAppState.ts"
import { HotKeysAppBarIcon } from "@src/apps/hot-keys/ui/HotKeysAppBarIcon.tsx"
import { HotKeysAppWidget } from "@src/apps/hot-keys/ui/HotKeysAppWidget.tsx"

export const HotKeysAppUI = () => {
  const state = useHotKeysAppState()

  return (
    <>
      <HotKeysAppWidget state={state} />
      <HotKeysAppBarIcon state={state} />
    </>
  )
}