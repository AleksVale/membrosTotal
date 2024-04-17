import { Helmet } from 'react-helmet-async'
import { DataTable } from '../../../components/DataTable'
import { useListPaymentRequestCollaborator } from './hooks/useListPaymentRequestCollaborator'
import { Headerbutton } from '../../../components/HeaderButton'
import { COLLABORATOR_PAGES } from '../../../utils/constants/routes'
import FilterPaymentRequest from './FilterPaymentRequest'

export const ListPaymentRequests = () => {
  const { columns, meta, payments } = useListPaymentRequestCollaborator()

  return (
    <section>
      <Helmet title="Compras" />
      <Headerbutton
        label="Solicitações de Compra"
        showButton
        labelButton="Criar Solicitação"
        navigateTo={COLLABORATOR_PAGES.newPaymentRequest}
      />
      <FilterPaymentRequest />
      <DataTable columns={columns} data={payments} meta={meta} />
    </section>
  )
}
