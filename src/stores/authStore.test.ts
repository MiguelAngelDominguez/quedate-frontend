import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'
import type { UserResponseDTO } from '@/types/api'

const mockUser: UserResponseDTO = {
  id: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@test.com',
  roles: ['USER'],
} as any

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    sessionStorage.clear()
  })

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
    expect(state.refreshToken).toBeNull()
  })

  it('setAuth stores user and tokens', () => {
    useAuthStore.getState().setAuth(mockUser, 'access-123', 'refresh-456')
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(mockUser)
    expect(state.accessToken).toBe('access-123')
    expect(state.refreshToken).toBe('refresh-456')
    expect(sessionStorage.getItem('quedate_refresh_token')).toBe('refresh-456')
  })

  it('setTokens updates tokens', () => {
    useAuthStore.getState().setAuth(mockUser, 'old-access', 'old-refresh')
    useAuthStore.getState().setTokens('new-access', 'new-refresh')
    const state = useAuthStore.getState()
    expect(state.accessToken).toBe('new-access')
    expect(state.refreshToken).toBe('new-refresh')
    expect(sessionStorage.getItem('quedate_refresh_token')).toBe('new-refresh')
  })

  it('setUser updates user', () => {
    useAuthStore.getState().setAuth(mockUser, 'access', 'refresh')
    const updated = { ...mockUser, firstName: 'Updated' }
    useAuthStore.getState().setUser(updated)
    expect(useAuthStore.getState().user?.firstName).toBe('Updated')
  })

  it('logout clears everything', () => {
    useAuthStore.getState().setAuth(mockUser, 'access', 'refresh')
    useAuthStore.getState().logout()
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
    expect(state.refreshToken).toBeNull()
    expect(sessionStorage.getItem('quedate_refresh_token')).toBeNull()
  })

  it('hydrate restores refreshToken from sessionStorage', () => {
    sessionStorage.setItem('quedate_refresh_token', 'stored-refresh')
    useAuthStore.getState().hydrate()
    const state = useAuthStore.getState()
    expect(state.refreshToken).toBe('stored-refresh')
    expect(state.isAuthenticated).toBe(true)
  })

  it('hydrate does nothing when no stored token', () => {
    useAuthStore.getState().hydrate()
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.refreshToken).toBeNull()
  })
})
