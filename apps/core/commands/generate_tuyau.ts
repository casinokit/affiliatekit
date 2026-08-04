import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class GenerateTuyau extends BaseCommand {
  static commandName = 'tuyau:generate'
  static description = 'Boot the app to trigger Tuyau generation hooks'
  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Tuyau registry generated via init hooks.')
  }
}
