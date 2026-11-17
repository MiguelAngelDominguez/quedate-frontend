import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor: attach access token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: handle 401 with refresh token
let isRefreshing = false
let pendingRequests: Array<(token: string | null) => void> = []

function onRefreshed(token: string | null) {
  pendingRequests.forEach((cb) => cb(token))
  pendingRequests = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const status = error.response?.status

    if (status === 401 && original && !original._retry) {
      const refreshToken = useAuthStore.getState().refreshToken
      if (!refreshToken) {
        useAuthStore.getState().logout()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push((token) => {
            if (!token) {
              reject(error)
              return
            }
            if (original.headers) original.headers.Authorization = `Bearer ${token}`
            resolve(api(original))
          })
        })
      }

      original._retry = true
      isRefreshing = true
      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
        const newAccess = res.data?.accessToken as string
        const newRefresh = (res.data?.refreshToken as string) ?? refreshToken
        useAuthStore.getState().setTokens(newAccess, newRefresh)
        onRefreshed(newAccess)
        if (original.headers) original.headers.Authorization = `Bearer ${newAccess}`
        return api(original)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        onRefreshed(null)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Errores globales: notificamos al usuario (los componentes pueden seguir
    // mostrando mensajes locales, pero el toast garantiza feedback inmediato).
    if (status !== 401) {
      toast.error(getErrorMessage(error))
    }
    return Promise.reject(error)
  },
)

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    if (data?.message) return data.message
    switch (error.response?.status) {
      case 400:
        return 'Los datos enviados no son válidos. Revisa el formulario.'
      case 401:
        return 'Tu sesión ha expirado. Inicia sesión nuevamente.'
      case 403:
        return 'No tienes permisos para realizar esta acción.'
      case 404:
        return 'Recurso no encontrado.'
      case 409:
        return 'El recurso ya existe o está en conflicto.'
      case 500:
        return 'Error del servidor. Intenta de nuevo más tarde.'
      default:
        break
    }
    if (!error.response) return 'Sin conexión con el servidor. Intenta de nuevo.'
    return 'Ocurrió un error inesperado. Intenta de nuevo.'
  }
  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado.'
}