import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    // We strictly enforce JSON formatting for our API
    if (ctx.request.url().startsWith('/api/')) {
      // Handle VineJS Validation errors explicitly
      if (error.code === 'E_VALIDATION_ERROR') {
        return ctx.response.fail('Validation failed', 422, error.messages)
      }

      // Handle all other errors
      const status = error.status || 500
      const message = status === 500 && !this.debug ? 'Internal Server Error' : error.message

      return ctx.response.fail(
        message,
        status,
        this.debug && status >= 500 ? error.stack : undefined
      )
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
