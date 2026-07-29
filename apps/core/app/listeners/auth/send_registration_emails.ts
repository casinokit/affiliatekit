import mail from '@adonisjs/mail/services/main'
import UserRegistered from '#events/auth/user_registered'
import RegistrationEmail from '#mails/auth/registration_email'
import VerifyEmail from '#mails/auth/verify_email'

export default class SendRegistrationEmails {
  async handle(event: UserRegistered) {
    await mail.sendLater(new RegistrationEmail(event.user))

    if (event.user.emailVerificationToken) {
      await mail.sendLater(new VerifyEmail(event.user, event.user.emailVerificationToken))
    }
  }
}