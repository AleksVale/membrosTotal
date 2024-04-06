import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DataTableColumnHeader } from '../../../../components/DataTableColumnHeader'
import { PaginationMeta } from '../../../../services/interfaces'
import { DEFAULT_META_PAGINATION } from '../../../../utils/constants/routes'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash, CheckSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Refundservice from '@/services/refund.service'
import { PaymentLabel } from '@/utils/interfaces/payment'
import { IRefund } from '../interface'

export function useListRefund() {
  const [searchParams] = useSearchParams()
  const [refunds, setRefunds] = useState<IRefund[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getRefunds = useCallback(async () => {
    const response = await Refundservice.getRefunds(searchParams)
    setRefunds(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  const handleConfirmPaidRefund = async (id: number) => {
    try {
      await Refundservice.finishRefund(id)
      getRefunds()
    } catch (error) {
      console.error(error)
    }
  }

  const handleConfirmDeleteRefund = async (id: number) => {
    try {
      await Refundservice.cancelRefund(id)
      getRefunds()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getRefunds()
  }, [getRefunds])

  const columns: ColumnDef<IRefund>[] = [
    {
      accessorKey: 'User.fullName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Usuário" />
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descrição" />
      ),
    },
    {
      accessorKey: 'value',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Valor" />
      ),
    },
    {
      accessorKey: 'RefundType.label',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoria" />
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      accessorFn: (row) => PaymentLabel[row.status],
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
        const refundRequest = row.original

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
                  onClick={() => handleConfirmPaidRefund(refundRequest.id)}
                  className="group flex items-center gap-2"
                >
                  <CheckSquare size={16} className="text-green-300" />
                  <span className="group-hover:text-green-300">
                    Confirmar reembolso
                  </span>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="group flex items-center gap-2">
                    <Trash size={16} className="text-destructive" />
                    <span className="group-hover:text-destructive">
                      Negar reembolso
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
                  negar esse reembolso?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant={'destructive'}
                    onClick={() => handleConfirmDeleteRefund(refundRequest.id)}
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
    refunds,
    meta,
  }
}
