import { create } from 'zustand'
import type { UserResponseDTO } from '@/types/api'

interface AuthState {
  user: UserResponseDTO | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (user: UserResponseDTO, accessToken: string, refreshToken: string) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: UserResponseDTO) => void
  logout: () => void
  hydrate: () => void
}

const REFRESH_KEY = 'quedate_refresh_token'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  setAuth: (user, accessToken, refreshToken) => {
    sessionStorage.setItem(REFRESH_KEY, refreshToken)
    set({ user, accessToken, refreshToken, isAuthenticated: true })
  },
  setTokens: (accessToken, refreshToken) => {
    sessionStorage.setItem(REFRESH_KEY, refreshToken)
    set({ accessToken, refreshToken, isAuthenticated: true })
  },
  setUser: (user) => set({ user }),
  logout: () => {
    sessionStorage.removeItem(REFRESH_KEY)
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
  },
  hydrate: () => {
    const refreshToken = sessionStorage.getItem(REFRESH_KEY)
    if (refreshToken) {
      // Reactivamos la sesión de forma optimista; App.tsx valida el refresh token
      // contra el backend y obtiene un nuevo access token.
      set({ refreshToken, isAuthenticated: true })
    }
  },
}))