import http from '@/lib/http'
import { User } from '@/pages/admin/User/interfaces'
import { EditProfileForm } from '@/pages/collaborator/Profile/interfaces'
import { SuccessResponse } from '@/utils/constants/routes'
import { Meeting } from './meeting.service'
import { PaginatedResponseDto } from './interfaces'
import { Payment } from '../utils/interfaces/payment'

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

const getPayments = async (searchParams: string) => {
  return http.get<PaginatedResponseDto<Payment>>(
    `collaborator/payments?${searchParams}`,
  )
}

const ColaboratorService = {
  update,
  getCurrentUser,
  getMeetings,
  getPayments,
}

export default ColaboratorService
