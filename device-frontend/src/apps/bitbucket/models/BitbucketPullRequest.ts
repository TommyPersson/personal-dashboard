export type BitbucketPullRequest = {
  id: number
  version: number
  title: string
  description: string
  state: PullRequestState
  createdAt: string
  updatedAt: string
  fromRepository: string
  fromBranch: string
  toRepository: string
  toBranch: string
  author: Participant
  reviewers: Participant[]
  belongsToUser: boolean
  userHasApproved: boolean
  numComments: number
  numResolvedTasks: number
  numOpenTasks: number
  url: string
}

export type Participant = {
  name: string
  role: ParticipantRole
  status: ParticipantStatus
}

export type ParticipantStatus = "UNAPPROVED" | "APPROVED" | "NEEDS_WORK"
export type ParticipantRole = "AUTHOR" | "REVIEWER"
export type PullRequestState = "OPEN" | "MERGED" | "DECLINED"