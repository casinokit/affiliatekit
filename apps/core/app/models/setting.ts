import { SettingSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

export default class Setting extends SettingSchema {
  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: any) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch (e) {
          return value
        }
      }
      return value
    },
  })
  declare value: any
}