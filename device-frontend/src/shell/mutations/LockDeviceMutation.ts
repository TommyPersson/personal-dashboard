import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { IsDeviceUnlockedQueryKey } from "@src/shell/queries/IsDeviceUnlockedQuery.ts"
import { mutationOptions } from "@tanstack/react-query"

export const LockDeviceMutation = mutationOptions({
  mutationKey: ["shell", "lockDevice"],
  mutationFn: async () => {
    await apiClient.post("/api/auth/lock-device", {})
  },
  // Shows the lock screen right away instead of after the round trip.
  onMutate: async (_args, context) => {
    await context.client.cancelQueries({ queryKey: IsDeviceUnlockedQueryKey })
    context.client.setQueryData(IsDeviceUnlockedQueryKey, false)
  },
  onSettled: (_data, _error, _args, _onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: IsDeviceUnlockedQueryKey }),
})
