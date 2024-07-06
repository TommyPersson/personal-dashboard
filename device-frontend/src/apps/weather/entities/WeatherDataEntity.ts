import { WeatherData } from "@src/apps/weather/modes/WeatherData.ts"
import { EntityType } from "@src/infrastructure/framework/entities"

export const WeatherDataEntity: EntityType<WeatherData> = {
  key: "weatherData",
  fetchUrl: "/api/apps/weather/data"
}

