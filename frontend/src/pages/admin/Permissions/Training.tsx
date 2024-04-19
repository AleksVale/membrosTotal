import { useTrainingPermission } from './hooks/useTrainingPermission'

import { useGoBack } from '@/hooks/useGoBack'
import { Helmet } from 'react-helmet-async'
import { BaseHeader } from '@/components/BaseHeader'
import { PermissionForm } from './PermissionForm'

export function TrainingPermissions() {
  const { training, users, form, isSubmitting, onSubmitForm } =
    useTrainingPermission()
  const { goBack } = useGoBack()
  return (
    <div>
      <Helmet title="Adicionar permissões" />
      <BaseHeader label={`Adicionar permissões ${training?.title}`} />

      <PermissionForm
        form={form}
        goBack={goBack}
        isSubmitting={isSubmitting}
        onSubmitForm={onSubmitForm}
        title={training?.title ?? ''}
        type="treinamento"
        users={users}
      />
    </div>
  )
}
