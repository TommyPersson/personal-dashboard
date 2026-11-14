import { ClaudeSession } from "@src/apps/claude-code/models/ClaudeSession.ts"
import { EntityType } from "@src/infrastructure/framework/entities"

export const ClaudeSessionsEntity: EntityType<ClaudeSession[]> = {
  key: "claude-code/sessions",
  fetchUrl: "/api/apps/claude/sessions",
  transform: (payload) => payload.sessions,
}
