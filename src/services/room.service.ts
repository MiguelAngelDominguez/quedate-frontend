import { api } from './api'
import type { Page, PublicationResponseDTO, RoomCreateDTO, RoomDetailDTO, RoomSummaryDTO, RoomUpdateDTO } from '@/types/api'
import type { AxiosRequestConfig } from 'axios'

export const roomService = {
  myRooms: (page = 0, size = 20, config?: AxiosRequestConfig) =>
    api.get<Page<RoomSummaryDTO>>('/rooms/my-rooms', { ...config, params: { page, size, ...config?.params } }).then((r) => r.data),
  create: (data: RoomCreateDTO, config?: AxiosRequestConfig) =>
    api.post<RoomDetailDTO>('/rooms', data, config).then((r) => r.data),
  update: (id: number, data: RoomUpdateDTO, config?: AxiosRequestConfig) =>
    api.put<RoomDetailDTO>(`/rooms/${id}`, data, config).then((r) => r.data),
  remove: (id: number, config?: AxiosRequestConfig) =>
    api.delete(`/rooms/${id}`, config).then((r) => r.data),
  publish: (id: number, config?: AxiosRequestConfig) =>
    api.post<PublicationResponseDTO>(`/my-rooms/${id}/publish`, {}, config).then((r) => r.data),
  archive: (id: number, config?: AxiosRequestConfig) =>
    api.post<PublicationResponseDTO>(`/my-rooms/${id}/archive`, {}, config).then((r) => r.data),
}