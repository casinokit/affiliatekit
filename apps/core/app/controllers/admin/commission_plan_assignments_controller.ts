import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import {
  createCommissionPlanAssignmentValidator,
  updateCommissionPlanAssignmentValidator,
} from '#validators/admin/commission_plan_assignment'
import CommissionPlanAssignmentService from '#services/commission_plan_assignment_service'

@inject()
export default class CommissionPlanAssignmentsController {
  constructor(private service: CommissionPlanAssignmentService) {}

  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const assignments = await this.service.getAssignments(page, limit)

    return response.success('Commission plan assignments retrieved successfully', assignments)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCommissionPlanAssignmentValidator)
    const assignment = await this.service.createAssignment(payload)

    return response.success('Commission plan assignment created successfully', assignment, 201)
  }

  async show({ params, response }: HttpContext) {
    const assignment = await this.service.getAssignment(params.id)

    return response.success('Commission plan assignment retrieved successfully', assignment)
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateCommissionPlanAssignmentValidator)
    const assignment = await this.service.updateAssignment(params.id, payload)

    return response.success('Commission plan assignment updated successfully', assignment)
  }

  async destroy({ params, response }: HttpContext) {
    await this.service.deleteAssignment(params.id)

    return response.success('Commission plan assignment deleted successfully')
  }
}
