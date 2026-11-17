import { api } from './api'
import type { AxiosRequestConfig } from 'axios'
import type { VerificationResponseDTO } from '@/types/api'

export const verificationService = {
  request: (data: { type: string; documentReference: string }, config?: AxiosRequestConfig) =>
    api.post<VerificationResponseDTO>('/me/verification', data, config).then((r) => r.data),
  pending: (config?: AxiosRequestConfig) =>
    api.get<VerificationResponseDTO[]>('/verifications/pending', config).then((r) => r.data),
  decide: (id: number, status: string, config?: AxiosRequestConfig) =>
    api.patch<VerificationResponseDTO>(`/verifications/${id}`, { status }, config).then((r) => r.data),
}