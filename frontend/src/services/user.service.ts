import http from '@/lib/http'
import { User } from '@/pages/admin/User/interfaces'

const getUsers = async (searchParams: URLSearchParams) => {
  return http.get<User[]>(`/user?${searchParams.toString()}`)
}

const UserService = {
  getUsers,
}

export default UserService
