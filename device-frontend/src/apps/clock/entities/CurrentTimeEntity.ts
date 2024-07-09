import { EntityType } from "@src/infrastructure/framework/entities"

export const CurrentTimeEntity: EntityType<Date> = {
  key: "clock/currentTime",
  fetchUrl: "/api/apps/clock/current-time",
  transform: (payload) => new Date(payload.currentTime)
}

