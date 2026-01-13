import { defineStore } from 'pinia'
import { useCartStore } from './cart'
import { api } from '../services/api'
import type { User, AuthResponse } from '../types'

// TYPES
interface AuthState {
  user: User | null
  token: string | null
}

// DATA
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token
  },

  actions: {
    async login(loginData: { provider: string; nickname: string; avatar: string }): Promise<AuthResponse> {
      try {
        const response = await api.auth.login(loginData)
        this.token = response.token
        this.user = response.user
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        return response
      } catch (error) {
        throw error
      }
    },

    async logout(): Promise<void> {
      try {
        await api.auth.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        const cartStore = useCartStore()
        cartStore.clear()
      }
    },

    init(): void {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      if (token && userStr) {
        this.token = token
        this.user = JSON.parse(userStr)
      }
    }
  }
})
