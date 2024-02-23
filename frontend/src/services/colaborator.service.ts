import http from '@/lib/http'
import { User } from '@/pages/admin/User/interfaces'
import { EditProfileForm } from '@/pages/collaborator/Profile/interfaces'
import { SuccessResponse } from '@/utils/constants/routes'
import { Meeting } from './meeting.service'
import { PaginatedResponseDto } from './interfaces'

const getCurrentUser = async () => {
  return http.get<User>(`collaborator/user`)
}

const update = async (user: EditProfileForm) => {
  return http.patch<SuccessResponse>(`collaborator/user`, user)
}

const getMeetings = async (searchParams: string) => {
  return http.get<PaginatedResponseDto<Meeting>>(
    `collaborator/meetings?${searchParams}`,
  )
}

const ColaboratorService = {
  update,
  getCurrentUser,
  getMeetings,
}

export default ColaboratorService
