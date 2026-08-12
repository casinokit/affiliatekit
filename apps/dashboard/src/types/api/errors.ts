export type ApiValidationError = {
  message: string
  field?: string
}

export type ApiErrorResponse = {
  message?: string
  errors?: ApiValidationError[]
}

export type FieldErrors = Record<string, string>

export type ApiErrorState = {
  message: string
  fieldErrors: FieldErrors
}
