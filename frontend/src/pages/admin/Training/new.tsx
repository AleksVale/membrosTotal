import { useCreateTraining } from './hooks/useCreateTraining'
import { CreateEditTrainingForm } from './components/CreateEditTrainingForm'
import { BaseHeader } from '@/components/BaseHeader'
import { Helmet } from 'react-helmet-async'

export function CreateTraining() {
  const { form, handleSubmitForm, isSubmitting } = useCreateTraining()
  return (
    <div>
      <Helmet title="Treinamentos" />
      <BaseHeader label="Criar treinamento" />
      <CreateEditTrainingForm
        form={form}
        onSubmitForm={handleSubmitForm}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
