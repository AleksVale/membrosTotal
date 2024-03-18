import { Helmet } from 'react-helmet-async'
import { DataTable } from '../../../components/DataTable'
import { useListPaymentRequestCollaborator } from './hooks/useListRefundCollaborator'
import { Headerbutton } from '../../../components/HeaderButton'
import { COLLABORATOR_PAGES } from '../../../utils/constants/routes'
import FilterPaymentRequest from './FilterPaymentRequest'

export const ListRefunds = () => {
  const { columns, meta, payments } = useListPaymentRequestCollaborator()

  return (
    <section>
      <Helmet title="Reembolsos" />
      <Headerbutton
        label="Reembolsos"
        showButton
        labelButton="Criar solicitação de reembolso"
        navigateTo={COLLABORATOR_PAGES.newRefund}
      />
      <FilterPaymentRequest />
      <DataTable columns={columns} data={payments} meta={meta} />
    </section>
  )
}
