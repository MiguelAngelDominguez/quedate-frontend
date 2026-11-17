import { api } from './api'
import type { AuthResponseDTO } from '@/types/api'
import type { AxiosRequestConfig } from 'axios'

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  role: 'USER' | 'LANDLORD'
}

export interface LoginPayload {
  email: string
  password: string
}

export const authService = {
  register: (data: RegisterPayload, config?: AxiosRequestConfig) =>
    api.post<AuthResponseDTO>('/auth/register', data, config).then((r) => r.data),
  login: (data: LoginPayload, config?: AxiosRequestConfig) =>
    api.post<AuthResponseDTO>('/auth/login', data, config).then((r) => r.data),
  refresh: (refreshToken: string, config?: AxiosRequestConfig) =>
    api.post<AuthResponseDTO>('/auth/refresh', { refreshToken }, config).then((r) => r.data),
}