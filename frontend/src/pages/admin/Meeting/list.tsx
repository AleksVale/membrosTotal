import { useListMeeting } from './hooks/useListMeeting'
import { DataTable } from '@/components/DataTable'
import FilterMeeting from '@/components/FilterMeetings'
import { HeaderMeeting } from '@/components/HeaderMeeting'
import { Helmet } from 'react-helmet-async'

export function ListMeetings() {
  const { columns, meta, meetings } = useListMeeting()
  return (
    <section>
      <Helmet title="Reuniões" />
      <HeaderMeeting label="Reuniões" showButton />
      <FilterMeeting />
      <DataTable columns={columns} data={meetings} meta={meta} />
    </section>
  )
}
