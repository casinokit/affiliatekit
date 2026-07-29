import { HttpResponse } from '@adonisjs/core/http'

HttpResponse.macro(
  'success',
  function (this: HttpResponse, message: string, data?: any, status: number = 200) {
    const payload: any = { success: true, message }
    if (data !== undefined && data !== null) {
      payload.data = data
    }

    this.status(status).json(payload)
    return this
  }
)

HttpResponse.macro(
  'fail',
  function (this: HttpResponse, message: string, status: number = 400, errors?: any) {
    const payload: any = { success: false, message }
    if (errors !== undefined && errors !== null) {
      payload.errors = errors
    }

    this.status(status).json(payload)
    return this
  }
)

declare module '@adonisjs/core/http' {
  interface HttpResponse {
    success(message: string, data?: any, status?: number): this
    fail(message: string, status?: number, errors?: any): this
  }
}
