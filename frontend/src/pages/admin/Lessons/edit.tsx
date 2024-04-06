import { CreateEditLessonForm } from './components/CreateEditLessonForm'
import { BaseHeader } from '@/components/BaseHeader'
import { Helmet } from 'react-helmet-async'
import { useEditLesson } from './hooks/useEditLesson'

export function EditLesson() {
  const { form, handleSubmitForm, isSubmitting } = useEditLesson()
  return (
    <div>
      <Helmet title="Editar submódulo" />
      <BaseHeader label="Editar submódulo" />
      <CreateEditLessonForm
        form={form}
        onSubmitForm={handleSubmitForm}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
