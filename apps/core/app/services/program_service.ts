import Program from '#models/program'
import type { CreateProgramDto, UpdateProgramDto } from '#validators/admin/program'
import { ProgramStatus } from '#enums/program_status'
import Brand from '#models/brand'
import db from '@adonisjs/lucid/services/db'

export default class ProgramService {
  /**
   * Get paginated list of programs
   */
  async getPrograms(page: number, limit: number, search?: string) {
    const query = Program.query().orderBy('createdAt', 'desc')

    if (search) {
      query.whereILike('name', `%${search}%`)
    }

    return query.paginate(page, limit)
  }

  /**
   * Find a single program by ID
   */
  async getProgram(id: string) {
    return Program.findOrFail(id)
  }

  /**
   * Create a new program
   */
  async createProgram(payload: CreateProgramDto) {
    const { brandIds, ...programPayload } = payload

    if (brandIds) {
      await this.validateBrandIds(brandIds)
    }

    return db.transaction(async (trx) => {
      const program = await Program.create(
        {
          ...programPayload,
          status: payload.status || ProgramStatus.ACTIVE,
        },
        { client: trx }
      )

      if (brandIds) {
        await program.related('brands').sync(brandIds)
      }

      return program
    })
  }

  /**
   * Update an existing program
   */
  async updateProgram(id: string, payload: UpdateProgramDto) {
    const { brandIds, ...programPayload } = payload

    if (brandIds) {
      await this.validateBrandIds(brandIds)
    }

    return db.transaction(async (trx) => {
      const program = await Program.query().useTransaction(trx).where('id', id).firstOrFail()
      program.useTransaction(trx)
      program.merge(programPayload)
      await program.save()

      if (brandIds) {
        await program.related('brands').sync(brandIds)
      }

      return program
    })
  }

  /**
   * Delete a program (Soft Delete)
   */
  async deleteProgram(id: string) {
    const program = await this.getProgram(id)
    await program.delete()
  }

  /**
   * Force delete a program (Hard Delete)
   */
  async forceDeleteProgram(id: string) {
    const program = (await Program.withTrashed().where('id', id).firstOrFail()) as Program
    await program.forceDelete()
  }

  private async validateBrandIds(brandIds: string[]) {
    for (const brandId of brandIds) {
      await Brand.findOrFail(brandId)
    }
  }
}
