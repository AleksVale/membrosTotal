import { Headerbutton } from '@/components/HeaderButton'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { Helmet } from 'react-helmet-async'

export function TrainingAdminList() {
  return (
    <div>
      <Helmet title="Treinamentos" />
      <Headerbutton
        label="Treinamentos"
        labelButton="Criar treinamento"
        navigateTo={ADMIN_PAGES.createTrainings}
        showButton
      />
    </div>
  )
}
