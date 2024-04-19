import { useGoBack } from '@/hooks/useGoBack'

import { Helmet } from 'react-helmet-async'
import { BaseHeader } from '@/components/BaseHeader'
import { useSubmodulePermission } from './hooks/useSubmodulePermission'
import { PermissionForm } from './PermissionForm'

export function SubmodulePermissions() {
  const { submodule, users, form, isSubmitting, onSubmitForm } =
    useSubmodulePermission()
  const { goBack } = useGoBack()
  return (
    <div>
      <Helmet title="Adicionar permissões" />
      <BaseHeader label="Adicionar permissões" />
      <PermissionForm
        form={form}
        goBack={goBack}
        isSubmitting={isSubmitting}
        onSubmitForm={onSubmitForm}
        title={submodule?.title ?? ''}
        type="submódulo"
        users={users}
      />
    </div>
  )
}
