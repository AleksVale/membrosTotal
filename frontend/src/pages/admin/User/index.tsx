import { DataTable } from '@/components/DataTable'
import { columns } from './columns'
import { useEffect, useState } from 'react'
import UserService, { PaginationMeta } from '@/services/user.service'
import { useSearchParams } from 'react-router-dom'
import { User } from './interfaces'
import { HeaderUser } from '@/components/HeaderUser'
import FilterUser from '@/components/FilterUser'

export function ListUser() {
  const [searchParams] = useSearchParams()
  const [data, setData] = useState<User[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({
    currentPage: 1,
    lastPage: 1,
    next: 1,
    perPage: 10,
    prev: 1,
    total: 1,
  })
  useEffect(() => {
    UserService.getUsers(searchParams).then((response) => {
      setData(response.data.data)
      setMeta(response.data.meta)
    })
  }, [searchParams])
  return (
    <div className="container mx-auto py-2">
      <HeaderUser label="Usuários" showButton />
      <FilterUser />
      <DataTable columns={columns} data={data} meta={meta} />
    </div>
  )
}
