export type UserRole = 'admin' | 'affiliate'

export type User = {
  id: string
  email: string
  fullName?: string
  full_name?: string
  avatar?: string
  companyName?: string
  meta?: Record<string, unknown>
  roles: string[]
  permissions: string[]
}
