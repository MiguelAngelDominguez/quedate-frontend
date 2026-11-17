import { api } from './api'
import type { AxiosRequestConfig } from 'axios'
import type { LocationDTO, Page, RoomDetailDTO, RoomSummaryDTO, UniversityDTO } from '@/types/api'

export const catalogService = {
  universities: (config?: AxiosRequestConfig) =>
    api.get<UniversityDTO[]>('/universities', config).then((r) => r.data),
  university: (id: number, config?: AxiosRequestConfig) =>
    api.get<UniversityDTO>(`/universities/${id}`, config).then((r) => r.data),
  locations: (district?: string, config?: AxiosRequestConfig) =>
    api.get<LocationDTO[]>('/locations', { ...config, params: { district, ...config?.params } }).then((r) => r.data),
  searchRooms: (params: Record<string, unknown>, config?: AxiosRequestConfig) =>
    api.get<Page<RoomSummaryDTO>>('/rooms', { ...config, params }).then((r) => r.data),
  room: (id: number, config?: AxiosRequestConfig) =>
    api.get<RoomDetailDTO>(`/rooms/${id}`, config).then((r) => r.data),
  landlordRooms: (landlordId: number, page = 0, size = 20, config?: AxiosRequestConfig) =>
    api.get<Page<RoomSummaryDTO>>(`/landlords/${landlordId}/rooms`, { ...config, params: { page, size, ...config?.params } }).then((r) => r.data),
}

