import { useCreateModule } from './hooks/useCreateModule'
import { CreateEditModuleForm } from './components/CreateEditModuleForm'
import { BaseHeader } from '@/components/BaseHeader'
import { Helmet } from 'react-helmet-async'

export function CreateModule() {
  const { form, handleSubmitForm, isSubmitting } = useCreateModule()
  return (
    <div>
      <Helmet title="Criar módulo" />
      <BaseHeader label="Criar módulos" />
      <CreateEditModuleForm
        form={form}
        onSubmitForm={handleSubmitForm}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
