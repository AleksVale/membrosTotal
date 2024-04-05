import { Headerbutton } from '@/components/HeaderButton'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { Helmet } from 'react-helmet-async'
import { useListTraining } from './hooks/useListTraining'
import { DataTable } from '@/components/DataTable'

export function TrainingAdminList() {
  const { training, columns, meta } = useListTraining()
  return (
    <div>
      <Helmet title="Treinamentos" />
      <Headerbutton
        label="Treinamentos"
        labelButton="Criar treinamento"
        navigateTo={ADMIN_PAGES.createTrainings}
        showButton
      />
      <DataTable columns={columns} data={training} meta={meta} />
    </div>
  )
}
