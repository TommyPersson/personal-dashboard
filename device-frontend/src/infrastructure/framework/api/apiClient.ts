import { Api } from "@mui/icons-material"
import { OperationError, OperationErrorData } from "@src/infrastructure/framework/errors"

export class ApiClient {
  constructor() {
  }

  async post<TRequestBody, TResponseBody>(path: string, body: TRequestBody) {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    })

    await this.handleAnyErrors(response)

    return await response.json() as TResponseBody
  }

  async get<TResponseBody>(path: string, searchParams?: Record<string, any>): Promise<TResponseBody> {
    const cleanSearchParams = removeUndefined(searchParams ?? {})
    if (Object.entries(cleanSearchParams).length > 0) {
      path = `${path}?${new URLSearchParams(cleanSearchParams).toString()}`
    }

    const response = await fetch(path, {
      method: "GET",
    })

    await this.handleAnyErrors(response)

    return await response.json() as TResponseBody
  }

  async delete(path: string): Promise<void> {
    const response = await fetch(path, {
      method: "DELETE",
    })

    await this.handleAnyErrors(response)
  }

  private async handleAnyErrors(response: Response) {
    if (!response.ok) {
      // TODO what if is not a regular error response?
      const body = await response.json() as OperationErrorData
      throw new OperationError(body)
    }
  }
}

function removeUndefined(object: Record<string, any | undefined>): Record<string, any> {
  return Object.fromEntries(Object.entries(object).filter(([key, value]) => value !== undefined))
}

export const apiClient = new ApiClient()