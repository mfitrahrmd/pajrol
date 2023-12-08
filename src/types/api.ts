type TErrorType = 'server' | 'client'

export type TErrorClient = { errorType: TErrorType } & {
  errors: Record<string, string[]>
}
export type TErrorServer = { errorType: TErrorType } & {
  message: string
}
