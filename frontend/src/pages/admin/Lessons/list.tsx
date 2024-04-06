import { Headerbutton } from '@/components/HeaderButton'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { Helmet } from 'react-helmet-async'
import { useListLesson } from './hooks/useListLesson'
import { DataTable } from '@/components/DataTable'

export function LessonAdminList() {
  const { lesson, columns, meta } = useListLesson()
  return (
    <div>
      <Helmet title="Aulas" />
      <Headerbutton
        label="Aulas"
        labelButton="Criar aula"
        navigateTo={ADMIN_PAGES.createLessons}
        showButton
      />
      <DataTable columns={columns} data={lesson} meta={meta} />
    </div>
  )
}
