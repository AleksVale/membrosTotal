import { Headerbutton } from '@/components/HeaderButton'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { Helmet } from 'react-helmet-async'
import { useListSubModule } from './hooks/useListSubModule'
import { DataTable } from '@/components/DataTable'

export function SubModuleAdminList() {
  const { module, columns, meta } = useListSubModule()
  return (
    <div>
      <Helmet title="Submódulo" />
      <Headerbutton
        label="Submódulos"
        labelButton="Criar Submódulo"
        navigateTo={ADMIN_PAGES.createSubModules}
        showButton
      />
      <DataTable columns={columns} data={module} meta={meta} />
    </div>
  )
}
