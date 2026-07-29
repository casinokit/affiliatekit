import emitter from '@adonisjs/core/services/emitter'
import UserRegistered from '#events/auth/user_registered'
import PasswordResetRequested from '#events/auth/password_reset_requested'

const SendRegistrationEmails = () => import('#listeners/auth/send_registration_emails')
const SendPasswordResetEmail = () => import('#listeners/auth/send_password_reset_email')

emitter.listen(UserRegistered, [SendRegistrationEmails])
emitter.listen(PasswordResetRequested, [SendPasswordResetEmail])
