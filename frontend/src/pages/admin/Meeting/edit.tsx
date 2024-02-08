import { Helmet } from 'react-helmet-async'
import { useEditMeeting } from './hooks/useEditMeeting'
import { CreateEditMeetingForm } from '@/components/meetingForm/CreateEditMeetingForm'
import { HeaderMeeting } from '@/components/HeaderMeeting'

export function EditMeeting() {
  const { form, isSubmitting, handleSubmitForm } = useEditMeeting()

  return (
    <div>
      <Helmet title="Editar reunião" />
      <HeaderMeeting label="Editar reunião" />
      <CreateEditMeetingForm
        form={form}
        isSubmitting={isSubmitting}
        onSubmitForm={handleSubmitForm}
      />
    </div>
  )
}
