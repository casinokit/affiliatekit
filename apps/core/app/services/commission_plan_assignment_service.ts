import CommissionPlanAssignment from '#models/commission_plan_assignment'
import Program from '#models/program'
import { Exception } from '@adonisjs/core/exceptions'
import type {
  CreateCommissionPlanAssignmentDto,
  UpdateCommissionPlanAssignmentDto,
} from '#validators/admin/commission_plan_assignment'

export default class CommissionPlanAssignmentService {
  async getAssignments(page: number, limit: number) {
    return CommissionPlanAssignment.query().orderBy('createdAt', 'desc').paginate(page, limit)
  }

  async getAssignment(id: string) {
    return CommissionPlanAssignment.findOrFail(id)
  }

  async createAssignment(payload: CreateCommissionPlanAssignmentDto) {
    await this.validateScope(payload.programId, payload.brandId)
    await this.ensureScopeIsAvailable(payload.programId, payload.brandId, payload.affiliateId)

    return CommissionPlanAssignment.create(payload)
  }

  async updateAssignment(id: string, payload: UpdateCommissionPlanAssignmentDto) {
    const assignment = await this.getAssignment(id)

    const programId = payload.programId || assignment.programId
    const brandId = payload.brandId === undefined ? assignment.brandId : payload.brandId
    const affiliateId = payload.affiliateId === undefined ? assignment.affiliateId : payload.affiliateId

    await this.validateScope(programId, brandId)
    await this.ensureScopeIsAvailable(programId, brandId, affiliateId, id)

    assignment.merge(payload)
    await assignment.save()

    return assignment
  }

  async deleteAssignment(id: string) {
    const assignment = await this.getAssignment(id)
    await assignment.delete()
  }

  private async validateScope(programId: string, brandId: string | null | undefined) {
    const program = await Program.findOrFail(programId)

    if (brandId) {
      await program.related('brands').query().where('brands.id', brandId).firstOrFail()
    }
  }

  private async ensureScopeIsAvailable(
    programId: string,
    brandId: string | null | undefined,
    affiliateId: string | null | undefined,
    exceptId?: string
  ) {
    const query = CommissionPlanAssignment.query().where('programId', programId)

    if (brandId) {
      query.where('brandId', brandId)
    } else {
      query.whereNull('brandId')
    }

    if (affiliateId) {
      query.where('affiliateId', affiliateId)
    } else {
      query.whereNull('affiliateId')
    }

    if (exceptId) {
      query.whereNot('id', exceptId)
    }

    if (await query.first()) {
      throw new Exception('A commission plan assignment already exists for this scope', { status: 409 })
    }
  }
}
