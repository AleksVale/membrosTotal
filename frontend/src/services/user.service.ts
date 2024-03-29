import http from '@/lib/http'
import { CreateUserForm, User } from '@/pages/admin/User/interfaces'
import { SuccessResponse } from '@/utils/constants/routes'
import { PaginatedResponseDto } from './interfaces'

const getUsers = async (searchParams: URLSearchParams) => {
  return http.get<PaginatedResponseDto<User>>(
    `/user?${searchParams.toString()}`,
  )
}

const getUser = async (id: string | undefined) => {
  return http.get<User>(`/user/${id}`)
}
const createUser = async (user: CreateUserForm) => {
  return http.post<SuccessResponse>('/user', user)
}

const update = async (user: CreateUserForm, id: number | string) => {
  return http.patch<SuccessResponse>(`/user/${id}`, user)
}

const UserService = {
  getUsers,
  createUser,
  update,
  getUser,
}

export default UserService
