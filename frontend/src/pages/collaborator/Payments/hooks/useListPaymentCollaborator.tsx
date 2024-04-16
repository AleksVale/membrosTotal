import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DataTableColumnHeader } from '../../../../components/DataTableColumnHeader'
import ColaboratorService from '../../../../services/colaborator.service'
import { PaginationMeta } from '../../../../services/interfaces'
import {
  COLLABORATOR_PAGES,
  DEFAULT_META_PAGINATION,
} from '../../../../utils/constants/routes'
import { Payment, PaymentLabel } from '../../../../utils/interfaces/payment'
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
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash } from 'lucide-react'
import { toast } from 'react-toastify'
import { StatusBadge } from '@/components/StatusBadge'

export function useListPaymentCollaborator() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [payments, setPayments] = useState<Payment[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getPayments = useCallback(async () => {
    const response = await ColaboratorService.getPayments(
      searchParams.toString(),
    )
    setPayments(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  useEffect(() => {
    getPayments()
  }, [getPayments])

  const handleConfirmDeletePayment = useCallback(
    async (id: number) => {
      const deleted = await ColaboratorService.deletePayment(id)
      if (deleted.data.success) {
        toast.success('Pagamento cancelado com sucesso')
        getPayments()
      }
    },
    [getPayments],
  )
  const columns: ColumnDef<Payment>[] = [
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
      accessorKey: 'PaymentType.label',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoria" />
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const original = row.original
        return <StatusBadge status={PaymentLabel[original.status]} />
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
        const payment = row.original

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
                    navigate(
                      `${COLLABORATOR_PAGES.prefix}/payments/${payment.id}/e`,
                    )
                  }
                  className="group flex items-center gap-2"
                >
                  <Edit size={16} className="text-primary" />
                  <span className="group-hover:text-primary">
                    Editar pagamento
                  </span>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="group flex items-center gap-2">
                    <Trash size={16} className="text-destructive" />
                    <span className="group-hover:text-destructive">
                      Cancelar pagamento
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
                  cancelar esse pagamento?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant={'destructive'}
                    onClick={() => handleConfirmDeletePayment(payment.id)}
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
    payments,
    meta,
  }
}
