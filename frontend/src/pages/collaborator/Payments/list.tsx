import { Helmet } from 'react-helmet-async'
import { DataTable } from '../../../components/DataTable'
import FilterMeeting from '../../../components/FilterMeetings'
import { useListPaymentCollaborator } from './hooks/useListPaymentCollaborator'
import { Headerbutton } from '../../../components/HeaderButton'
import { COLLABORATOR_PAGES } from '../../../utils/constants/routes'

export const ListPayment = () => {
  const { columns, meta, payments } = useListPaymentCollaborator()

  return (
    <section>
      <Helmet title="Pagamentos" />
      <Headerbutton
        label="Pagametos"
        showButton
        labelButton="Criar pagamento"
        navigateTo={COLLABORATOR_PAGES.newPayment}
      />
      <FilterMeeting />
      <DataTable columns={columns} data={payments} meta={meta} />
    </section>
  )
}
