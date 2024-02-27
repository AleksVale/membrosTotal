import { ColumnDef } from '@tanstack/react-table'
import { format, addMinutes } from 'date-fns'
import { DataTableColumnHeader } from '@/components/DataTableColumnHeader'
import { Link, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { Meeting, MeetingStatus } from '@/services/meeting.service'
import { PaginationMeta } from '@/services/interfaces'
import { DEFAULT_META_PAGINATION } from '@/utils/constants/routes'
import ColaboratorService from '@/services/colaborator.service'

export function useListColaboratorMeetings() {
  const [searchParams] = useSearchParams()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getMeetings = useCallback(async () => {
    const response = await ColaboratorService.getMeetings(
      searchParams.toString(),
    )
    setMeetings(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  useEffect(() => {
    getMeetings()
  }, [getMeetings])

  const columns: ColumnDef<Meeting>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descrição" />
      ),
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data" />
      ),
      accessorFn: (row) =>
        format(
          addMinutes(row.date, new Date(row.date).getTimezoneOffset()),
          'dd/MM/yyyy HH:mm',
        ),
    },
    {
      accessorKey: 'link',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Link" />
      ),
      cell: ({ row }) => {
        const original = row.original
        return (
          <Link to={original.link} target="_blank">
            {original.link}
          </Link>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      accessorFn: (row) => MeetingStatus[row.status],
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Criado em" />
      ),
      accessorFn: (row) => format(row.createdAt, 'dd/MM/yyyy'),
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Atualizada em" />
      ),
      accessorFn: (row) => format(row.updatedAt, 'dd/MM/yyyy'),
    },
  ]
  return {
    columns,
    meetings,
    meta,
  }
}
