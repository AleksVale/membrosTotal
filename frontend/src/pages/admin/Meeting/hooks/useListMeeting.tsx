import { ColumnDef } from '@tanstack/react-table'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash } from 'lucide-react'

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
import { useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import MeetingService, { Meeting } from '@/services/meeting.service'
import { PaginationMeta } from '@/services/interfaces'
import { DEFAULT_META_PAGINATION } from '@/utils/constants/routes'

export function useListMeeting() {
  const [searchParams] = useSearchParams()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)
  const handleConfirmDeleteUser = (id: number) => {
    console.log('deleting user', id)
  }

  const getMeetings = useCallback(async () => {
    const response = await MeetingService.getMeetings(searchParams)
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
    },
    {
      accessorKey: 'link',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Link" />
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Criado em" />
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Atualizada em" />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original

        return (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="flex items-center gap-2 group">
                    <span className="group-hover:text-destructive">
                      Cancelar reunião
                    </span>{' '}
                    <Trash size={16} className="text-destructive" />
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
                    onClick={() => handleConfirmDeleteUser(user.id)}
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
