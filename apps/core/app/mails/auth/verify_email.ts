import { BaseMail } from '@adonisjs/mail'
import User from '#models/user'

export default class VerifyEmail extends BaseMail {
  subject = 'Please verify your email address'

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
      .htmlView('emails/auth/verify_email', { user: this.user, token: this.token })
  }
}
