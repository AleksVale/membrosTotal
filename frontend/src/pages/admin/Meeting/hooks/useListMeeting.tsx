import { ColumnDef } from '@tanstack/react-table'
import { format, addMinutes } from 'date-fns'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CheckSquareIcon, Edit, MoreHorizontal, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/DataTableColumnHeader'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { Link, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import MeetingService, {
  Meeting,
  MeetingStatus,
} from '@/services/meeting.service'
import { PaginationMeta } from '@/services/interfaces'
import { ADMIN_PAGES, DEFAULT_META_PAGINATION } from '@/utils/constants/routes'
import { toast } from 'react-toastify'
import { StatusBadge } from '@/components/StatusBadge'

export function useListMeeting() {
  const [searchParams] = useSearchParams()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getMeetings = useCallback(async () => {
    const response = await MeetingService.getMeetings(searchParams)
    setMeetings(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  const handleCancelMeeting = async (id: number) => {
    const { data } = await MeetingService.cancelMeeting(id)
    if (data.success) {
      toast.success('Reunião cancelada com sucesso')
    }
    getMeetings()
  }

  const handleFinishMeeting = async (id: number) => {
    const { data } = await MeetingService.finishMeeting(id)
    if (data.success) {
      toast.success('Reunião finalizada com sucesso')
    }
    getMeetings()
  }
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
      cell: ({ row }) => {
        const original = row.original
        return <StatusBadge status={MeetingStatus[original.status]} />
      },
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
    {
      id: 'actions',
      cell: ({ row }) => {
        const meeting = row.original

        return (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem
                  className="group flex items-center gap-2"
                  asChild
                >
                  <Link to={`${ADMIN_PAGES.prefix}/meetings/${meeting.id}/e`}>
                    <Edit size={16} className="text-primary" />
                    <span className="group-hover:text-primary">
                      Editar reunião
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    handleFinishMeeting(meeting.id)
                  }}
                  className="group flex items-center gap-2"
                >
                  <CheckSquareIcon size={16} className="text-emerald-400" />
                  <span className="group-hover:text-emerald-400">
                    Finalizar reunião
                  </span>
                </DropdownMenuItem>

                <DialogTrigger asChild>
                  <DropdownMenuItem className="group flex items-center gap-2">
                    <X size={16} className="text-destructive" />
                    <span className="group-hover:text-destructive">
                      Cancelar reunião
                    </span>
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Você tem certeza?</DialogTitle>
                <DialogDescription>
                  Essa ação não pode ser desfeita. Você tem certeza que deseja
                  cancelar essa reunião?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant={'destructive'}
                    onClick={() => handleCancelMeeting(meeting.id)}
                  >
                    Cancelar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      },
    },
  ]
  return {
    columns,
    meetings,
    meta,
  }
}
