import { useBitbucketAppState } from "@src/apps/bitbucket/state/BitbucketAppState.ts"
import { BitbucketAppBarIcon } from "@src/apps/bitbucket/ui/BitbucketAppBarIcon.tsx"
import { BitbucketAppWidget } from "@src/apps/bitbucket/ui/BitbucketAppWidget.tsx"
import { BitbucketLockScreenIcon } from "@src/apps/bitbucket/ui/BitbucketLockScreenIcon.tsx"
import React from "react"

export const BitbucketAppUI = () => {
  const state = useBitbucketAppState()

  return (
    <>
      <BitbucketAppWidget state={state} />
      <BitbucketAppBarIcon state={state} />
      <BitbucketLockScreenIcon state={state} />
    </>
  )
}
