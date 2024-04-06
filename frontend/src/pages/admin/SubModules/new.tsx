import { useCreateSubModule } from './hooks/useCreateSubModule'
import { CreateEditSubModuleForm } from './components/CreateEditSubModuleForm'
import { BaseHeader } from '@/components/BaseHeader'
import { Helmet } from 'react-helmet-async'

export function CreateSubModule() {
  const { form, handleSubmitForm, isSubmitting } = useCreateSubModule()
  return (
    <div>
      <Helmet title="Criar Submódulo" />
      <BaseHeader label="Criar Submódulos" />
      <CreateEditSubModuleForm
        form={form}
        onSubmitForm={handleSubmitForm}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
