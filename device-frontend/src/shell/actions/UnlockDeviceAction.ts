import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { ActionType } from "@src/infrastructure/framework/entities/useAction.tsx"

export const UnlockDeviceAction: ActionType<{ pinCode: string }, void> = {
  key: "auth/unlockDeviceAction",
  action: async ({ pinCode }) => {
    await apiClient.post("/api/auth/unlock-device", { pinCode })
  },
}
