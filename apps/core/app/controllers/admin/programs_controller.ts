import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { createProgramValidator, updateProgramValidator } from '#validators/admin/program'
import ProgramService from '#services/program_service'

@inject()
export default class ProgramsController {
  constructor(private programService: ProgramService) {}

  /**
   * Return list of all programs
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search')

    const programs = await this.programService.getPrograms(page, limit, search)

    return response.success('Programs retrieved successfully', programs)
  }

  /**
   * Create a new program
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProgramValidator)

    const program = await this.programService.createProgram(payload)

    return response.success('Program created successfully', program, 201)
  }

  /**
   * Show a single program by id
   */
  async show({ params, response }: HttpContext) {
    const program = await this.programService.getProgram(params.id)

    return response.success('Program retrieved successfully', program)
  }

  /**
   * Update program details
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProgramValidator)

    const program = await this.programService.updateProgram(params.id, payload)

    return response.success('Program updated successfully', program)
  }

  /**
   * Delete or deactivate a program (Soft Delete)
   */
  async destroy({ params, response }: HttpContext) {
    await this.programService.deleteProgram(params.id)

    return response.success('Program deleted successfully')
  }

  /**
   * Permanently delete a program
   */
  async forceDestroy({ params, response }: HttpContext) {
    await this.programService.forceDeleteProgram(params.id)

    return response.success('Program permanently deleted')
  }

}
