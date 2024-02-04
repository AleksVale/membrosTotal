import { ColumnDef } from '@tanstack/react-table'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Meeting } from '../interfaces'

const handleConfirmDeleteUser = (id: number) => {
  console.log('deleting user', id)
}

export const columns: ColumnDef<Meeting>[] = [
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
                    Deletar usuário
                  </span>{' '}
                  <Trash size={16} className="text-destructive" />
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Editar usuário</DropdownMenuItem>
              <DropdownMenuItem>Enviar um zap</DropdownMenuItem>
              <DropdownMenuItem>Enviar uma notificação</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Você tem certeza?</DialogTitle>
              <DialogDescription>
                Essa ação não pode ser desfeita. Você tem certeza que deseja
                deletar esse usuário?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant={'destructive'}
                  onClick={() => handleConfirmDeleteUser(user.id)}
                >
                  Deletar
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    },
  },
]
