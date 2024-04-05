import { Headerbutton } from '@/components/HeaderButton'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { Helmet } from 'react-helmet-async'
import { useListModule } from './hooks/useListModule'
import { DataTable } from '@/components/DataTable'

export function ModuleAdminList() {
  const { module, columns, meta } = useListModule()
  return (
    <div>
      <Helmet title="Módulos" />
      <Headerbutton
        label="Módulos"
        labelButton="Criar módulo"
        navigateTo={ADMIN_PAGES.createModules}
        showButton
      />
      <DataTable columns={columns} data={module} meta={meta} />
    </div>
  )
}
