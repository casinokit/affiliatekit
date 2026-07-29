import { BaseMail } from '@adonisjs/mail'
import User from '#models/user'

export default class ResetPasswordEmail extends BaseMail {
  subject = 'Password Reset Request'

  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    this.message
      .to(this.user.email)
      .htmlView('emails/auth/reset_password', { user: this.user, token: this.token })
  }
}
