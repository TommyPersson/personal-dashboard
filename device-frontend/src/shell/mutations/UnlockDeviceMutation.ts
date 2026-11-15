import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { IsDeviceUnlockedQueryKey } from "@src/shell/queries/IsDeviceUnlockedQuery.ts"
import { mutationOptions } from "@tanstack/react-query"

export const UnlockDeviceMutation = mutationOptions({
  mutationKey: ["shell", "unlockDevice"],
  mutationFn: async (args: { pinCode: string }) => {
    await apiClient.post("/api/auth/unlock-device", { pinCode: args.pinCode })
  },
  onSettled: (_data, _error, _args, _onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: IsDeviceUnlockedQueryKey }),
})
