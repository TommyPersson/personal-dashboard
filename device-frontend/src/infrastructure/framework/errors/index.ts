
export interface OperationErrorData {
  requestId: string
  errorCode: string
  errorMessage: string
}

export class OperationError extends Error  {
  constructor(readonly data: OperationErrorData) {
    super(`${data.errorCode}: ${data.errorMessage}`)
  }
}
