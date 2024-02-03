import { DataTable } from '@/components/DataTable'
import { columns } from './columns'
import { useEffect, useState } from 'react'
import UserService from '@/services/user.service'
import { useSearchParams } from 'react-router-dom'
import { User } from './interfaces'
import { HeaderUser } from '@/components/HeaderUser'

export function ListUser() {
  const [searchParams] = useSearchParams()
  const [data, setData] = useState<User[]>([])
  useEffect(() => {
    UserService.getUsers(searchParams).then((response) => {
      setData(response.data.data)
    })
  }, [searchParams])
  return (
    <div className="container mx-auto py-2">
      <HeaderUser label="Usuários" showButton />
      <DataTable columns={columns} data={data} />
    </div>
  )
}
