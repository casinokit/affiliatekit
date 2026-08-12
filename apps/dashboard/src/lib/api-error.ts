export type ApiErrorState = {
  message: string
  fieldErrors: Record<string, string>
}

export function normalizeApiError(error: any, defaultMessage: string): ApiErrorState {
  const response = error?.response
  const fieldErrors: Record<string, string> = {}
  let generalMessage = ''

  if (Array.isArray(response?.errors)) {
    response.errors.forEach((item: any) => {
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
      (Object.keys(fieldErrors).length > 0 ? '' : response?.message || error?.message || defaultMessage),
    fieldErrors,
  }
}
