import http from '@/lib/http'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'
import { User } from '@/pages/admin/User/interfaces'

export enum MeetingStatus {
  PENDING = 'Pendente',
  DONE = 'Realizada',
  CANCELED = 'Cancelada',
}
interface UserMeeting {
  userId: number
  meetingId: number
  User: User
}

export interface Meeting {
  id: number
  date: string
  status: 'PENDING' | 'DONE' | 'CANCELED'
  link: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  UserMeeting: UserMeeting[]
}

const getMeetings = async (searchParams: URLSearchParams) => {
  return http.get<PaginatedResponseDto<Meeting>>(
    `/meetings?${searchParams.toString()}`,
  )
}

const get = async (id: string) => {
  return http.get<Meeting>(`/meetings/${id}`)
}
const createMeeting = async (meeting: unknown) => {
  return http.post<SuccessResponse>('/meetings', meeting)
}

const update = async (meeting: unknown, id: string) => {
  return http.patch<SuccessResponse>(`/meetings/${id}`, meeting)
}

const cancelMeeting = async (id: number) => {
  return http.patch<SuccessResponse>(`/meetings/${id}/cancel`)
}

const finishMeeting = async (id: number) => {
  return http.patch<SuccessResponse>(`/meetings/${id}/finish`)
}

const MeetingService = {
  getMeetings,
  createMeeting,
  cancelMeeting,
  finishMeeting,
  update,
  get,
}

export default MeetingService
