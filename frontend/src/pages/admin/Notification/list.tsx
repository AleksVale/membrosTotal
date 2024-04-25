import { Headerbutton } from '@/components/HeaderButton'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { Helmet } from 'react-helmet-async'
import { useListNotification } from './hooks/useListNotification'
import { DataTable } from '@/components/DataTable'

export function NotificationList() {
  const { meta, notifications, columns } = useListNotification()
  return (
    <div>
      <Helmet title="Notificações" />
      <Headerbutton
        label="Notificações"
        labelButton="Criar notificação"
        navigateTo={ADMIN_PAGES.createNotification}
        showButton={true}
      />
      <DataTable columns={columns} data={notifications} meta={meta} />
    </div>
  )
}
