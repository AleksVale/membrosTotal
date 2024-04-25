import http from '@/lib/http'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'
import { NotificationResponseDTO } from './home.service'

const getNotification = async (searchParams: URLSearchParams) => {
  return http.get<PaginatedResponseDto<NotificationResponseDTO>>(
    `/admin-notification?${searchParams.toString()}`,
  )
}

const get = async (id: string) => {
  return http.get<NotificationResponseDTO>(`/admin-notification/${id}`)
}
const createNotification = async (notification: unknown) => {
  return http.post<SuccessResponse>('/admin-notification', notification)
}

const update = async (notification: unknown, id: string) => {
  return http.patch<SuccessResponse>(`/admin-notification/${id}`, notification)
}

const readNotification = async (id: number) => {
  return http.patch<SuccessResponse>(`/collaborator-notification/${id}/read`)
}

const NotificationService = {
  getNotification,
  createNotification,
  readNotification,
  update,
  get,
}

export default NotificationService
