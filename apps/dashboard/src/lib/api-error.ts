import type { ApiErrorResponse, ApiErrorState } from '@/types'

export type { ApiErrorState } from '@/types'

type UnknownApiError = {
  message?: string
  response?: ApiErrorResponse
}

export function normalizeApiError(error: unknown, defaultMessage: string): ApiErrorState {
  const apiError = error as UnknownApiError
  const response = apiError.response
  const fieldErrors: Record<string, string> = {}
  let generalMessage = ''

  if (response?.errors) {
    response.errors.forEach((item) => {
      if (item.field && !fieldErrors[item.field]) {
        fieldErrors[item.field] = item.message
      }

      if (!item.field && !generalMessage) {
        generalMessage = item.message
      }
    })
  }

  return {
    message:
      generalMessage ||
      (Object.keys(fieldErrors).length > 0 ? '' : response?.message || apiError.message || defaultMessage),
    fieldErrors,
  }
}
