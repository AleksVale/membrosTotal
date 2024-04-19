import { DataTable } from '@/components/DataTable'
import { Helmet } from 'react-helmet-async'
import { useListExpert } from './useListExpert'
import { BaseHeader } from '@/components/BaseHeader'

export function ExpertList() {
  const { experts, meta, expertColumns } = useListExpert()
  return (
    <div>
      <Helmet title="Solicitação de experts" />
      <BaseHeader label="Experts" />
      <div className="overflow-hidden">
        <DataTable columns={expertColumns} data={experts} meta={meta} />
      </div>
    </div>
  )
}
