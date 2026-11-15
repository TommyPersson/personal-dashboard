import { LockOpenOutlined } from "@mui/icons-material"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { defineCommand } from "@src/infrastructure/framework/commands/Command.ts"
import { IsDeviceUnlockedQueryKey } from "@src/shell/queries/IsDeviceUnlockedQuery.ts"

export const UnlockDeviceCommand = defineCommand({
  mutationOptions: {
    mutationKey: ["shell", "unlockDevice"],
    mutationFn: async (args: { pinCode: string }) => {
      await apiClient.post("/api/auth/unlock-device", { pinCode: args.pinCode })
    },
    onSettled: (_data, _error, _args, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: IsDeviceUnlockedQueryKey }),
  },
  label: "Unlock",
  icon: LockOpenOutlined,
  errorTitle: "Unable to unlock",
})
