import { RunDeckData } from "@src/apps/run-deck/models/RunDeckData.ts"
import { EntityType } from "@src/infrastructure/framework/entities"

export const RunDeckDataEntity: EntityType<RunDeckData> = {
  key: "runDeckData",
  fetchUrl: "/api/apps/run-deck/data"
}

