import { EntityType } from "@src/infrastructure/framework/entities"
import { DateTime } from "luxon"

export const CurrentTimeEntity: EntityType<DateTime> = {
  key: "clock/currentTime",
  fetchUrl: "/api/apps/clock/current-time",
  transform: (payload) => DateTime.fromISO(payload.currentTime)
}

