import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'

import { User } from './interfaces'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/DataTableColumnHeader'

export const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {row.original.firstName} {row.original.lastName}
        </span>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'Profile.label',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Perfil" />
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefone" />
    ),
  },
  {
    accessorKey: 'document',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Documento" />
    ),
  },
  {
    accessorKey: 'birthDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de nascimento" />
    ),
    accessorFn: (row) => dayjs(row.birthDate).format('DD/MM/YYYY'),
  },
  {
    accessorKey: 'instagram',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Instagram" />
    },
  },
  {
    accessorKey: 'pix',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chave pix" />
    ),
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar usuário</DropdownMenuItem>
            <DropdownMenuItem>Enviar um zap</DropdownMenuItem>
            <DropdownMenuItem>Enviar uma notificação</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
