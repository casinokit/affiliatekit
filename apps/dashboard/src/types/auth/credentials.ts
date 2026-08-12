export type LoginCredentials = {
  email: string
  password: string
  remember?: boolean
}

export type ForgotPasswordPayload = {
  email: string
}

export type AuthTokenResponse = {
  token: string
}
