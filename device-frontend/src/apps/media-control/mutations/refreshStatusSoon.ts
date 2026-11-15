import { MediaControlStatusQueryKey } from "@src/apps/media-control/queries/MediaControlStatusQuery.ts"
import { delay } from "@src/infrastructure/utils"
import { MutationFunctionContext } from "@tanstack/react-query"

const refreshAfterActionDelayMs = 1_000

/**
 * An `onSettled` for the playback mutations. The player on the workstation takes a moment to pick up a command, so the
 * status is refreshed a little later. The mutation doesn't wait for it, so the controls are enabled again right away.
 */
export function refreshStatusSoon(
  _data: unknown,
  _error: unknown,
  _args: unknown,
  _onMutateResult: unknown,
  context: MutationFunctionContext,
) {
  void delay(refreshAfterActionDelayMs).then(() =>
    context.client.invalidateQueries({ queryKey: MediaControlStatusQueryKey }),
  )
}
