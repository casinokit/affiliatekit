import { BaseEvent } from '@adonisjs/core/events'
import User from '#models/user'

export default class PasswordResetRequested extends BaseEvent {
  constructor(public user: User, public token: string) {
    super()
  }
}