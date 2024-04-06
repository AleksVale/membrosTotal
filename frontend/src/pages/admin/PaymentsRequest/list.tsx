import { Helmet } from 'react-helmet-async'
import { DataTable } from '../../../components/DataTable'
import { useListPaymentRequest } from './hooks/useListPaymentRequest'
import FilterPaymentRequest from './FilterPaymentRequest'
import { BaseHeader } from '@/components/BaseHeader'

export const ListPaymentRequestsAdmin = () => {
  const { columns, meta, paymentRequests } = useListPaymentRequest()

  return (
    <section>
      <Helmet title="Solicitação de pagamentos" />
      <BaseHeader label="Solicitação de pagementos" />
      <FilterPaymentRequest />
      <DataTable columns={columns} data={paymentRequests} meta={meta} />
    </section>
  )
}
