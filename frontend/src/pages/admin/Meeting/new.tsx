import { useCreateMeeting } from './hooks/useCreateMeeting'
import { HeaderMeeting } from '@/components/HeaderMeeting'
import { Helmet } from 'react-helmet-async'
import { CreateEditMeetingForm } from '@/components/meetingForm/CreateEditMeetingForm'

export function CreateMeeting() {
  const { form, isSubmitting, handleSubmitForm } = useCreateMeeting()

  return (
    <div>
      <Helmet title="Nova reunião" />
      <HeaderMeeting label="Criar reunião" />
      <CreateEditMeetingForm
        form={form}
        isSubmitting={isSubmitting}
        onSubmitForm={handleSubmitForm}
      />
    </div>
  )
}
