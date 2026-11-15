import { zx } from "@src/infrastructure/framework/schemas/zx.ts"
import { z } from "zod"

export const ParticipantStatusSchema = z.enum(["UNAPPROVED", "APPROVED", "NEEDS_WORK"])
export type ParticipantStatus = z.infer<typeof ParticipantStatusSchema>

export const ParticipantRoleSchema = z.enum(["AUTHOR", "REVIEWER"])
export type ParticipantRole = z.infer<typeof ParticipantRoleSchema>

export const PullRequestStateSchema = z.enum(["OPEN", "MERGED", "DECLINED"])
export type PullRequestState = z.infer<typeof PullRequestStateSchema>

export const ParticipantSchema = z.object({
  name: z.string(),
  role: ParticipantRoleSchema,
  status: ParticipantStatusSchema,
})

export type Participant = z.infer<typeof ParticipantSchema>

export const BitbucketPullRequestSchema = z.object({
  id: z.number(),
  version: z.number(),
  title: z.string(),
  description: z.string(),
  state: PullRequestStateSchema,
  createdAt: zx.dateTime(),
  updatedAt: zx.dateTime(),
  fromRepository: z.string(),
  fromBranch: z.string(),
  toRepository: z.string(),
  toBranch: z.string(),
  author: ParticipantSchema,
  reviewers: z.array(ParticipantSchema),
  belongsToUser: z.boolean(),
  userHasApproved: z.boolean(),
  numComments: z.number(),
  numResolvedTasks: z.number(),
  numOpenTasks: z.number(),
  url: z.string(),
})

export type BitbucketPullRequest = z.infer<typeof BitbucketPullRequestSchema>

export type BitbucketPullRequestDTO = z.input<typeof BitbucketPullRequestSchema>
