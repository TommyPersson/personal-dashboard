import { OperationErrorData } from "@src/infrastructure/framework/errors"
import { HttpResponse } from "msw"

/** An MSW error response in the shape the backend uses, so `ApiClient` turns it into an `OperationError`. */
export function apiError(status: number, errorCode: string, errorMessage: string) {
  const body: OperationErrorData = { requestId: "mocked", errorCode, errorMessage }
  return HttpResponse.json(body, { status })
}
