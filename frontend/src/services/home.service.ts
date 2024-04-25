import http from '@/lib/http'
import { Meeting } from './meeting.service'

export interface NotificationResponseDTO {
  id: number
  title: string
  message: string
  read: boolean
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
