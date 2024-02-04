import http from '@/lib/http'
import { CreateUserForm, User } from '@/pages/admin/User/interfaces'
import { SuccessResponse } from '@/utils/constants/routes'

export interface PaginationMeta {
  total: number
  lastPage: number
  currentPage: number
  perPage: number
  prev: number | null
  next: number | null
}

export interface PaginatedResponseDto<T> {
  data: T[]
  meta: PaginationMeta
}

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
