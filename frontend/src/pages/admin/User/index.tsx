import { DataTable } from '@/components/DataTable'
import { useColumnsUser } from './columns'
import { HeaderUser } from '@/components/HeaderUser'
import FilterUser from '@/components/FilterUser'

import { Helmet } from 'react-helmet-async'

export function ListUser() {
  const { columns, data, meta } = useColumnsUser()
  return (
    <div>
      <Helmet title="Usuários" />
      <HeaderUser label="Usuários" showButton />
      <FilterUser />
      <DataTable columns={columns} data={data} meta={meta} />
    </div>
  )
}
