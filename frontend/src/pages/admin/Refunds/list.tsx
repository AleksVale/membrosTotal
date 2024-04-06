import { Helmet } from 'react-helmet-async'
import { DataTable } from '../../../components/DataTable'
import { useListRefund } from './hooks/useListRefund'
import FilterRefund from './FilterRefund'
import { BaseHeader } from '@/components/BaseHeader'

export const ListRefundsAdmin = () => {
  const { columns, meta, refunds } = useListRefund()

  return (
    <section>
      <Helmet title="Reembolsos" />
      <BaseHeader label="Reembolsos" />
      <FilterRefund />
      <DataTable columns={columns} data={refunds} meta={meta} />
    </section>
  )
}
