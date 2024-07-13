import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { ActionType } from "@src/infrastructure/framework/entities/useAction.tsx"

export const LockDeviceAction: ActionType<void, void> = {
  key: "auth/lockDeviceAction",
  action: async () => {
    await apiClient.post("/api/auth/lock-device", {})
  },
}
