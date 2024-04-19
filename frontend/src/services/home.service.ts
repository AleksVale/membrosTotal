import http from '@/lib/http'
import { Meeting } from './meeting.service'

interface HomeResponse {
  meetings: Meeting[]
}

export const HomeService = {
  get: async () => {
    const response = await http.get<HomeResponse>(`collaborator/home`)
    return response.data
  },
}
