import { useCreateLesson } from './hooks/useCreateLesson'
import { CreateEditLessonForm } from './components/CreateEditLessonForm'
import { BaseHeader } from '@/components/BaseHeader'
import { Helmet } from 'react-helmet-async'

export function CreateLesson() {
  const { form, handleSubmitForm, isSubmitting } = useCreateLesson()
  return (
    <div>
      <Helmet title="Criar aula" />
      <BaseHeader label="Criar aula" />
      <CreateEditLessonForm
        form={form}
        onSubmitForm={handleSubmitForm}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
