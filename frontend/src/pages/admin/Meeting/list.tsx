import { useListMeeting } from './hooks/useListMeeting'
import { DataTable } from '@/components/DataTable'
import { HeaderMeeting } from '@/components/HeaderMeeting'

export function ListMeetings() {
  const { columns, meta, meetings } = useListMeeting()
  return (
    <section>
      <HeaderMeeting label="Reuniões" showButton />
      <DataTable columns={columns} data={meetings} meta={meta} />
    </section>
  )
}
