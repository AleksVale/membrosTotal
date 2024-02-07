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
import { Edit, MoreHorizontal, Trash } from 'lucide-react'

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
import { formatToDocument, formatToPhoneNumber } from '@/utils/formatters'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { useNavigate } from 'react-router-dom'

export function useColumnsUser() {
  const navigate = useNavigate()
  const handleConfirmDeleteUser = (id: string) => {
    console.log('deleting user', id)
  }

  const columns: ColumnDef<User>[] = [
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
      accessorFn: (row) => formatToPhoneNumber(row.phone) || '--',
    },
    {
      accessorKey: 'document',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Documento" />
      ),
      accessorFn: (row) => formatToDocument(row.document) || '--',
    },
    {
      accessorKey: 'birthDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de nascimento" />
      ),
      accessorFn: (row) => dayjs(row.birthDate).utc(false).format('DD/MM/YYYY'),
    },
    {
      accessorKey: 'instagram',
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Instagram" />
      },
    },
    {
      accessorKey: 'pixKey',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Chave pix" />
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
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`${ADMIN_PAGES.prefix}/user/${user.id}/e`)
                  }
                  className="flex items-center gap-2 group"
                >
                  <Edit size={16} className="text-primary" />
                  <span className="group-hover:text-primary">
                    Editar usuário
                  </span>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="flex items-center gap-2 group">
                    <Trash size={16} className="text-destructive" />
                    <span className="group-hover:text-destructive">
                      Deletar usuário
                    </span>
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

  return {
    columns,
  }
}
