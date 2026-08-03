import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  email: string
  roles: string[]
  permissions: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('auth_token', newToken)
  }

  const setUser = (userData: User) => {
    user.value = userData
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
  }

  return {
    user,
    token,
    setToken,
    setUser,
    logout,
  }
})
