import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import {
  createCommissionPlanValidator,
  updateCommissionPlanValidator,
} from '#validators/admin/commission_plan'
import CommissionPlanService from '#services/commission_plan_service'

@inject()
export default class CommissionPlansController {
  constructor(private service: CommissionPlanService) {}

  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search')
    const plans = await this.service.getCommissionPlans(page, limit, search)

    return response.success('Commission plans retrieved successfully', plans)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCommissionPlanValidator)
    const plan = await this.service.createCommissionPlan(payload)

    return response.success('Commission plan created successfully', plan, 201)
  }

  async show({ params, response }: HttpContext) {
    const plan = await this.service.getCommissionPlan(params.id)

    return response.success('Commission plan retrieved successfully', plan)
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateCommissionPlanValidator)
    const plan = await this.service.updateCommissionPlan(params.id, payload)

    return response.success('Commission plan updated successfully', plan)
  }

  async destroy({ params, response }: HttpContext) {
    await this.service.deleteCommissionPlan(params.id)

    return response.success('Commission plan deleted successfully')
  }

  async forceDestroy({ params, response }: HttpContext) {
    await this.service.forceDeleteCommissionPlan(params.id)

    return response.success('Commission plan permanently deleted')
  }
}
