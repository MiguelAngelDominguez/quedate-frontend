import { api } from './api'
import type { AxiosRequestConfig } from 'axios'
import type {
  RatingSummaryDTO,
  RentalRequestResponseDTO,
  ReviewResponseDTO,
  VisitResponseDTO,
} from '@/types/api'

export const trustService = {
  createRentalRequest: (roomId: number, data: { message?: string; startDate: string; endDate: string }, config?: AxiosRequestConfig) =>
    api.post<RentalRequestResponseDTO>(`/rooms/${roomId}/rental-requests`, data, config).then((r) => r.data),
  myRentalRequests: (config?: AxiosRequestConfig) =>
    api.get<RentalRequestResponseDTO[]>('/my-rental-requests', config).then((r) => r.data),
  landlordRequests: (config?: AxiosRequestConfig) =>
    api.get<RentalRequestResponseDTO[]>('/my-requests-landlord', config).then((r) => r.data),
  updateRequestStatus: (id: number, status: string, config?: AxiosRequestConfig) =>
    api.patch<RentalRequestResponseDTO>(`/rental-requests/${id}/status`, { status }, config).then((r) => r.data),
  createVisit: (requestId: number, data: { scheduledAt: string; notes?: string }, config?: AxiosRequestConfig) =>
    api.post<VisitResponseDTO>(`/rental-requests/${requestId}/visits`, data, config).then((r) => r.data),
  listVisits: (requestId: number, config?: AxiosRequestConfig) =>
    api.get<VisitResponseDTO[]>(`/rental-requests/${requestId}/visits`, config).then((r) => r.data),
  updateVisitStatus: (id: number, status: string, config?: AxiosRequestConfig) =>
    api.patch<VisitResponseDTO>(`/visits/${id}/status`, { status }, config).then((r) => r.data),
  createReview: (roomId: number, data: { rating: number; comment?: string }, config?: AxiosRequestConfig) =>
    api.post<ReviewResponseDTO>(`/rooms/${roomId}/reviews`, data, config).then((r) => r.data),
  listReviews: (roomId: number, config?: AxiosRequestConfig) =>
    api.get<ReviewResponseDTO[]>(`/rooms/${roomId}/reviews`, config).then((r) => r.data),
  landlordRating: (landlordId: number, config?: AxiosRequestConfig) =>
    api.get<RatingSummaryDTO>(`/landlords/${landlordId}/rating`, config).then((r) => r.data),
}