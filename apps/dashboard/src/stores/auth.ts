import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  email: string
  fullName?: string
  full_name?: string
  avatar?: string
  companyName?: string
  meta?: Record<string, any>
  roles: string[]
  permissions: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const storedUser = sessionStorage.getItem('auth_user')
  const storedToken = sessionStorage.getItem('auth_token')
  const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)
  const token = ref<string | null>(storedToken)

  const setToken = (newToken: string) => {
    token.value = newToken
    sessionStorage.setItem('auth_token', newToken)
  }

  const setUser = (userData: User) => {
    user.value = userData
    sessionStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const logout = () => {
    token.value = null
    user.value = null
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('auth_user')
  }

  return {
    user,
    token,
    setToken,
    setUser,
    logout,
  }
})
