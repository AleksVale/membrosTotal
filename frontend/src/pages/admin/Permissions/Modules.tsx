import { useGoBack } from '@/hooks/useGoBack'

import { Helmet } from 'react-helmet-async'
import { BaseHeader } from '@/components/BaseHeader'
import { PermissionForm } from './PermissionForm'
import { useModulePermission } from './hooks/useModulePermission'
// import { useModulePermission } from './hooks/useModulePermission'

export function ModulesPermission() {
  const { module, users, form, isSubmitting, onSubmitForm } =
    useModulePermission()
  const { goBack } = useGoBack()
  return (
    <div>
      <Helmet title="Adicionar permissões" />
      <BaseHeader label="Adicionar permissões" />
      <PermissionForm
        form={form}
        isSubmitting={isSubmitting}
        onSubmitForm={onSubmitForm}
        users={users}
        goBack={goBack}
        title={module?.title ?? ''}
        type="módulo"
      />
    </div>
  )
}
