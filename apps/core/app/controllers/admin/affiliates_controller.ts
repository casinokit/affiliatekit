import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { createAffiliateValidator, updateAffiliateValidator } from '#validators/admin/affiliate'
import AffiliateService from '#services/affiliate_service'
import CommissionPlanAssignmentService from '#services/commission_plan_assignment_service'
import {
  createCommissionPlanAssignmentValidator,
  updateCommissionPlanAssignmentValidator,
} from '#validators/admin/commission_plan_assignment'
import { UserStatus } from '#enums/user_status'

@inject()
export default class AffiliatesController {
  constructor(
    private service: AffiliateService,
    private assignmentService: CommissionPlanAssignmentService
  ) {}

  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search')
    const status = request.input('status') as UserStatus | undefined
    const affiliates = await this.service.getAffiliates(page, limit, search, status)

    return response.success('Affiliates retrieved successfully', affiliates)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createAffiliateValidator)
    const affiliate = await this.service.createAffiliate(payload)

    return response.success('Affiliate created successfully', affiliate, 201)
  }

  async show({ params, response }: HttpContext) {
    const affiliate = await this.service.getAffiliate(params.id)

    return response.success('Affiliate retrieved successfully', affiliate)
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateAffiliateValidator)
    const affiliate = await this.service.updateAffiliate(params.id, payload)

    return response.success('Affiliate updated successfully', affiliate)
  }

  async destroy({ params, response }: HttpContext) {
    await this.service.deleteAffiliate(params.id)

    return response.success('Affiliate deleted successfully')
  }

  async forceDestroy({ params, response }: HttpContext) {
    await this.service.forceDeleteAffiliate(params.id)

    return response.success('Affiliate permanently deleted')
  }

  async commissionPlans({ params, request, response }: HttpContext) {
    await this.service.getAffiliate(params.id)

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const assignments = await this.assignmentService.getAssignmentsForAffiliate(
      params.id,
      page,
      limit
    )

    return response.success('Affiliate commission plans retrieved successfully', assignments)
  }

  async assignCommissionPlan({ params, request, response }: HttpContext) {
    await this.service.getAffiliate(params.id)
    const payload = await request.validateUsing(createCommissionPlanAssignmentValidator)
    const assignment = await this.assignmentService.createAssignment({
      ...payload,
      affiliateId: params.id,
    })

    return response.success('Commission plan assigned to affiliate successfully', assignment, 201)
  }

  async updateCommissionPlan({ params, request, response }: HttpContext) {
    await this.assignmentService.getAffiliateAssignment(params.id, params.assignmentId)
    const payload = await request.validateUsing(updateCommissionPlanAssignmentValidator)
    const assignment = await this.assignmentService.updateAssignment(params.assignmentId, {
      ...payload,
      affiliateId: params.id,
    })

    return response.success('Affiliate commission plan updated successfully', assignment)
  }

  async removeCommissionPlan({ params, response }: HttpContext) {
    await this.assignmentService.getAffiliateAssignment(params.id, params.assignmentId)
    await this.assignmentService.deleteAssignment(params.assignmentId)

    return response.success('Affiliate commission plan removed successfully')
  }
}
