import FilterMeeting from '@/components/FilterMeetings'
import { useListColaboratorMeetings } from './hooks/useListColaboratorMeetings'
import { Helmet } from 'react-helmet-async'
import { DataTable } from '@/components/DataTable'
import { BaseHeader } from '@/components/BaseHeader'

export function ColaboratorListMeeting() {
  const { columns, meta, meetings } = useListColaboratorMeetings()

  return (
    <section>
      <Helmet title="Reuniões" />
      <BaseHeader label="Reuniões" />
      <FilterMeeting />
      <DataTable columns={columns} data={meetings} meta={meta} />
    </section>
  )
}
