import http from '@/lib/http'
import { Meeting } from './meeting.service'
import { User } from '@/pages/admin/User/interfaces'

export interface INotificationUser {
  id: number
  userId: number
  notificationId: number
  read: boolean
  User: User
}
export interface NotificationResponseDTO {
  id: number
  title: string
  description: string
  NotificationUser: INotificationUser[]
  createdAt: Date
}

interface HomeResponse {
  meetings: Meeting[]
  notifications: NotificationResponseDTO[]
}

export const HomeService = {
  get: async () => {
    const response = await http.get<HomeResponse>(`collaborator/home`)
    return response.data
  },
}
