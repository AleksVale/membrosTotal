import http from '@/lib/http'
import { User } from '@/pages/admin/User/interfaces'

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

const UserService = {
  getUsers,
}

export default UserService
