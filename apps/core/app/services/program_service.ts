import Program from '#models/program'
import type { CreateProgramDto, UpdateProgramDto } from '#validators/admin/program'
import { ProgramStatus } from '#enums/program_status'

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
    return Program.create({
      ...payload,
      status: payload.status || ProgramStatus.ACTIVE,
    })
  }

  /**
   * Update an existing program
   */
  async updateProgram(id: string, payload: UpdateProgramDto) {
    const program = await this.getProgram(id)
    program.merge(payload)
    await program.save()

    return program
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
}
