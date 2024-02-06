import http from '@/lib/http'
import { CreateUserForm, User } from '@/pages/admin/User/interfaces'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'

const getUsers = async (searchParams: URLSearchParams) => {
  return http.get<PaginatedResponseDto<User>>(
    `/user?${searchParams.toString()}`,
  )
}

const createUser = async (user: CreateUserForm) => {
  return http.post<SuccessResponse>('/user', user)
}

const UserService = {
  getUsers,
  createUser,
}

export default UserService
