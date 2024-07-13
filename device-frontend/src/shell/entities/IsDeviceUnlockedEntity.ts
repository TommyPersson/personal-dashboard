import { EntityType } from "@src/infrastructure/framework/entities"

export const IsDeviceUnlockedEntity: EntityType<boolean> = {
  key: "auth/isDeviceUnlockedEntity",
  fetchUrl: "/api/auth/is-device-unlocked",
  transform: payload => payload.isDeviceUnlocked
}