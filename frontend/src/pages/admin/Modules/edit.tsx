import { CreateEditModuleForm } from './components/CreateEditModuleForm'
import { BaseHeader } from '@/components/BaseHeader'
import { Helmet } from 'react-helmet-async'
import { useEditModule } from './hooks/useEditModule'

export function EditModule() {
  const { form, handleSubmitForm, isSubmitting } = useEditModule()
  return (
    <div>
      <Helmet title="Editar módulo" />
      <BaseHeader label="Editar módulo" />
      <CreateEditModuleForm
        form={form}
        onSubmitForm={handleSubmitForm}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
