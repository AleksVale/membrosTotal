import { Helmet } from 'react-helmet-async'
import { DataTable } from '../../../components/DataTable'
import { useListPayment } from './hooks/useListPayment'
import { Headerbutton } from '../../../components/HeaderButton'
import { ADMIN_PAGES } from '../../../utils/constants/routes'
import FilterPayment from './FilterPayment'

export const ListPaymentAdmin = () => {
  const { columns, meta, payments } = useListPayment()

  return (
    <section>
      <Helmet title="Pagamentos" />
      <Headerbutton
        label="Solicitações de Pagamento"
        showButton
        labelButton="Criar pagamento"
        navigateTo={ADMIN_PAGES.newPayment}
      />
      <FilterPayment />
      <DataTable columns={columns} data={payments} meta={meta} />
    </section>
  )
}
