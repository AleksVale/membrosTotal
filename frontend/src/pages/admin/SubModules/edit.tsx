import { CreateEditSubModuleForm } from './components/CreateEditSubModuleForm'
import { BaseHeader } from '@/components/BaseHeader'
import { Helmet } from 'react-helmet-async'
import { useEditSubModule } from './hooks/useEditSubModule'

export function EditSubModule() {
  const { form, handleSubmitForm, isSubmitting } = useEditSubModule()
  return (
    <div>
      <Helmet title="Editar submódulo" />
      <BaseHeader label="Editar submódulo" />
      <CreateEditSubModuleForm
        form={form}
        onSubmitForm={handleSubmitForm}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
