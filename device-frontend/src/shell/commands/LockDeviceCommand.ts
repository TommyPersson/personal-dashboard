import { Lock } from "@mui/icons-material"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { defineCommand } from "@src/infrastructure/framework/commands/Command.ts"
import { IsDeviceUnlockedQueryKey } from "@src/shell/queries/IsDeviceUnlockedQuery.ts"

export const LockDeviceCommand = defineCommand({
  mutationOptions: {
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
  },
  label: "Lock",
  icon: Lock,
  errorTitle: "Unable to lock the device",
})
