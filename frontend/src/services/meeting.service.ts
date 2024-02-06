import http from '@/lib/http'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'

export interface Meeting {
  id: number
  date: string
  status: string
  link: string
  title: string
  description: string
  created_at: string
  updated_at: string
}

const getMeetings = async (searchParams: URLSearchParams) => {
  return http.get<PaginatedResponseDto<Meeting>>(
    `/meetings?${searchParams.toString()}`,
  )
}

const createMeeting = async (meeting: unknown) => {
  return http.post<SuccessResponse>('/meetings', meeting)
}

const MeetingService = {
  getMeetings,
  createMeeting,
}

export default MeetingService
