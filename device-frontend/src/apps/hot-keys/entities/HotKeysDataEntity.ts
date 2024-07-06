import { HotKeysData } from "@src/apps/hot-keys/models/HotKeysData.ts"
import { EntityType } from "@src/infrastructure/framework/entities"

export const HotKeysDataEntity: EntityType<HotKeysData> = {
  key: "hotKeysdata",
  fetchUrl: "/api/apps/hot-keys/data"
}

