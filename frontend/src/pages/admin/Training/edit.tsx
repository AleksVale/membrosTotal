import { CreateEditTrainingForm } from './components/CreateEditTrainingForm'
import { BaseHeader } from '@/components/BaseHeader'
import { Helmet } from 'react-helmet-async'
import { useEditTraining } from './hooks/useEditTraining'

export function EditTraining() {
  const { form, handleSubmitForm, isSubmitting } = useEditTraining()
  return (
    <div>
      <Helmet title="Editar treinamentos" />
      <BaseHeader label="Editar treinamento" />
      <CreateEditTrainingForm
        form={form}
        onSubmitForm={handleSubmitForm}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
