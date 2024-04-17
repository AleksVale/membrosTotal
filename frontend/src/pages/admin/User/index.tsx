import { DataTable } from '@/components/DataTable'
import { useColumnsUser } from './columns'
import { useEffect, useState } from 'react'
import UserService from '@/services/user.service'
import { useSearchParams } from 'react-router-dom'
import { User } from './interfaces'
import { HeaderUser } from '@/components/HeaderUser'
import FilterUser from '@/components/FilterUser'
import { DEFAULT_META_PAGINATION } from '@/utils/constants/routes'
import { PaginationMeta } from '@/services/interfaces'
import { Helmet } from 'react-helmet-async'

export function ListUser() {
  const [searchParams] = useSearchParams()
  const [data, setData] = useState<User[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)
  useEffect(() => {
    UserService.getUsers(searchParams).then((response) => {
      setData(response.data.data)
      setMeta(response.data.meta)
    })
  }, [searchParams])
  const { columns } = useColumnsUser()
  return (
    <div>
      <Helmet title="Usuários" />
      <HeaderUser label="Usuários" showButton />
      <FilterUser />
      <DataTable columns={columns} data={data} meta={meta} />
    </div>
  )
}
