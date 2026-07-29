import mail from '@adonisjs/mail/services/main'
import PasswordResetRequested from '#events/auth/password_reset_requested'
import ResetPasswordEmail from '#mails/auth/reset_password_email'

export default class SendPasswordResetEmail {
  async handle(event: PasswordResetRequested) {
    await mail.sendLater(new ResetPasswordEmail(event.user, event.token))
  }
}