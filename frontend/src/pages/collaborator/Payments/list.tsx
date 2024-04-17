import { Helmet } from 'react-helmet-async'
import { DataTable } from '../../../components/DataTable'
import { useListPaymentCollaborator } from './hooks/useListPaymentCollaborator'
import { Headerbutton } from '../../../components/HeaderButton'
import { COLLABORATOR_PAGES } from '../../../utils/constants/routes'
import FilterPayment from './FilterPayment'

export const ListPayment = () => {
  const { columns, meta, payments } = useListPaymentCollaborator()

  return (
    <section>
      <Helmet title="Pagamentos" />
      <Headerbutton
        label="Solicitações de Pagamento"
        showButton
        labelButton="Criar Solicitação"
        navigateTo={COLLABORATOR_PAGES.newPayment}
      />
      <FilterPayment />
      <DataTable columns={columns} data={payments} meta={meta} />
    </section>
  )
}
