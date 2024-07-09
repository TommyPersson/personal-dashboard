export type GithubNotification = {
  "id": number,
  "unread": boolean,
  "lastReadAt": string | null,
  "reason": string,
  "title": string,
  "type": string,
  "url": string | null,
  "repositoryFullName": string,
  "updatedAt": string
}