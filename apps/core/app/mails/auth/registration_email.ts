import { BaseMail } from '@adonisjs/mail'
import User from '#models/user'

export default class RegistrationEmail extends BaseMail {
  subject = 'Welcome to our platform!'

  constructor(private user: User) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    this.message.to(this.user.email).htmlView('emails/auth/registration_email', { user: this.user })
  }
}
