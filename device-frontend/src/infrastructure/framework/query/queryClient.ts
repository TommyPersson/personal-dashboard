import { replaceEqualDeepWithLuxon } from "@src/infrastructure/framework/query/structuralSharing.ts"
import { QueryClient } from "@tanstack/react-query"

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        structuralSharing: replaceEqualDeepWithLuxon,
      },
    },
  })
}
