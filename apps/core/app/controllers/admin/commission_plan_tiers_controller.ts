import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import {
  createCommissionPlanTierValidator,
  updateCommissionPlanTierValidator,
} from '#validators/admin/commission_plan_tier'
import CommissionPlanTierService from '#services/commission_plan_tier_service'

@inject()
export default class CommissionPlanTiersController {
  constructor(private service: CommissionPlanTierService) {}

  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const tiers = await this.service.getTiers(page, limit)

    return response.success('Commission plan tiers retrieved successfully', tiers)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCommissionPlanTierValidator)
    const tier = await this.service.createTier(payload)

    return response.success('Commission plan tier created successfully', tier, 201)
  }

  async show({ params, response }: HttpContext) {
    const tier = await this.service.getTier(params.id)

    return response.success('Commission plan tier retrieved successfully', tier)
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateCommissionPlanTierValidator)
    const tier = await this.service.updateTier(params.id, payload)

    return response.success('Commission plan tier updated successfully', tier)
  }

  async destroy({ params, response }: HttpContext) {
    await this.service.deleteTier(params.id)

    return response.success('Commission plan tier deleted successfully')
  }
}
