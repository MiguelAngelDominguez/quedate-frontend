import { api } from './api'
import type { LandlordResponseDTO, StudentResponseDTO, UserResponseDTO } from '@/types/api'
import type { AxiosRequestConfig } from 'axios'

export const userService = {
  me: (config?: AxiosRequestConfig) => api.get<UserResponseDTO>('/users/me', config).then((r) => r.data),
  updateMe: (data: Partial<UserResponseDTO>, config?: AxiosRequestConfig) =>
    api.put<UserResponseDTO>('/users/me', data, config).then((r) => r.data),
  student: (id: number, config?: AxiosRequestConfig) =>
    api.get<StudentResponseDTO>(`/students/${id}`, config).then((r) => r.data),
  updateStudent: (id: number, data: Partial<StudentResponseDTO>, config?: AxiosRequestConfig) =>
    api.put<StudentResponseDTO>(`/students/${id}`, data, config).then((r) => r.data),
  updateLandlordProfile: (data: Partial<LandlordResponseDTO>, config?: AxiosRequestConfig) =>
    api.put<LandlordResponseDTO>('/landlords/me/profile', data, config).then((r) => r.data),
  adminUsers: (config?: AxiosRequestConfig) =>
    api.get<UserResponseDTO[]>('/admin/users', config).then((r) => r.data),
}