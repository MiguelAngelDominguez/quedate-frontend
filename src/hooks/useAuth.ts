import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/auth.service'
import { userService } from '@/services/user.service'
import { getErrorMessage } from '@/services/api'
import type { RegisterPayload } from '@/services/auth.service'

export function useAuth() {
  const store = useAuthStore()
  const qc = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => authService.login(data),
    onSuccess: (res) => {
      store.setAuth(res.userInfo, res.accessToken, res.refreshToken)
      qc.invalidateQueries({ queryKey: ['me'] })
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
    onSuccess: (res) => {
      store.setAuth(res.userInfo, res.accessToken, res.refreshToken)
    },
  })

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: () => userService.me(),
    enabled: store.isAuthenticated,
    retry: false,
  })

  return {
    user: store.user ?? meQuery.data ?? null,
    isAuthenticated: store.isAuthenticated,
    login: loginMutation.mutateAsync,
    loginPending: loginMutation.isPending,
    loginError: loginMutation.error ? getErrorMessage(loginMutation.error) : null,
    register: registerMutation.mutateAsync,
    registerPending: registerMutation.isPending,
    registerError: registerMutation.error ? getErrorMessage(registerMutation.error) : null,
    logout: () => {
      store.logout()
      qc.clear()
    },
  }
}