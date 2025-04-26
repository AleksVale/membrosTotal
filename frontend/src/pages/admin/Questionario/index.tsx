import { DataTable } from '@/components/DataTable'
import { HeaderUser } from '@/components/HeaderUser'

import { Helmet } from 'react-helmet-async'
import { useColumnsQuestionario } from './columns'

export function ListQuestionario() {
  const { columns, data, meta } = useColumnsQuestionario()
  return (
    <div>
      <Helmet title="Vaga Vídeo" />
      <HeaderUser label="Vaga Vídeo" />
      <div className="max-w-(--breakpoint-2xl) overflow-hidden py-12">
        <DataTable columns={columns} data={data} meta={meta} />
      </div>
    </div>
  )
}
