import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'

import { CreateUserForm, User } from './interfaces'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BellRing,
  CheckCircle,
  Edit,
  MoreHorizontal,
  PhoneCall,
  Trash,
} from 'lucide-react'

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
import { ADMIN_PAGES, DEFAULT_META_PAGINATION } from '@/utils/constants/routes'
import { useNavigate, useSearchParams } from 'react-router-dom'
import UserService from '@/services/user.service'
import { toast } from 'react-toastify'
import { useCallback, useEffect, useState } from 'react'
import { PaginationMeta } from '@/services/interfaces'
import { UserStatus, UserStatusLabel } from '@/utils/interfaces/payment'
import { StatusBadge } from '@/components/StatusBadge'

export function useColumnsUser() {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const [data, setData] = useState<User[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)
  const getUsers = useCallback(() => {
    UserService.getUsers(searchParams).then((response) => {
      setData(response.data.data)
      setMeta(response.data.meta)
    })
  }, [searchParams])
  useEffect(() => {
    getUsers()
  }, [getUsers])

  const handleConfirmDeleteUser = async (id: string) => {
    const deleted = await UserService.remove(id)
    if (deleted.data.success) {
      toast.success('Usuário inativado com sucesso!')
      getUsers()
    }
  }

  const handleActivateUser = async (id: string) => {
    const updated = await UserService.update(
      { status: UserStatus.ACTIVE } as CreateUserForm,
      id,
    )
    if (updated.data.success) {
      toast.success('Usuário ativado com sucesso!')
      getUsers()
    }
  }

  const renderUserOption = (status: UserStatus) => {
    if (status === UserStatus.ACTIVE) {
      return (
        <DialogTrigger asChild>
          <DropdownMenuItem className="group flex items-center gap-2">
            <Trash size={16} className="text-destructive" />
            <span className="group-hover:text-destructive">
              Inativar usuário
            </span>
          </DropdownMenuItem>
        </DialogTrigger>
      )
    }
    return (
      <DialogTrigger asChild>
        <DropdownMenuItem className="group flex items-center gap-2">
          <CheckCircle size={16} className="text-green-800" />
          <span className="group-hover:text-green-600">Ativar usuário</span>
        </DropdownMenuItem>
      </DialogTrigger>
    )
  }

  const renderDialogOption = (user: User) => {
    if (user.status === UserStatus.ACTIVE) {
      return (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
            <DialogDescription>
              Essa ação bloqueará o acesso do usuário a plataforma.
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
      )
    }
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Você tem certeza?</DialogTitle>
          <DialogDescription>
            Essa ação permitirá o acesso do usuário a plataforma.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant={'secondary'}
              onClick={() => handleActivateUser(user.id)}
            >
              Ativar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    )
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
        <DataTableColumnHeader column={column} title="Tipo de Conta" />
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
        <DataTableColumnHeader column={column} title="CPF" />
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
      accessorKey: 'pixKey',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="PIX" />
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const original = row.original
        return <StatusBadge status={UserStatusLabel[original.status]} />
      },
    },

    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original

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
                  onClick={() =>
                    navigate(`${ADMIN_PAGES.prefix}/user/${user.id}/e`)
                  }
                  className="group flex items-center gap-2"
                >
                  <Edit size={16} className="text-primary" />
                  <span className="group-hover:text-primary">
                    Editar usuário
                  </span>
                </DropdownMenuItem>
                {renderUserOption(user.status)}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="group flex items-center gap-2">
                  <PhoneCall size={16} className="text-lime-500" />
                  <span className="group-hover:text-lime-500">
                    {' '}
                    Enviar um zap{' '}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="group flex items-center gap-2">
                  <BellRing size={16} className="text-amber-500" />
                  <span className="group-hover:text-amber-500">
                    {' '}
                    Enviar uma notificação{' '}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {renderDialogOption(user)}
          </Dialog>
        )
      },
    },
  ]

  return {
    columns,
    data,
    meta,
  }
}
