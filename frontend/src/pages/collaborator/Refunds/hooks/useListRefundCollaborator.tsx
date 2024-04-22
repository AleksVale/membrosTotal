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
import {
  PaymentLabel,
  PaymentStatus,
  RefundResponseDto,
} from '../../../../utils/interfaces/payment'
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

export function useListPaymentRequestCollaborator() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [payments, setPayments] = useState<RefundResponseDto[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getRefunds = useCallback(async () => {
    const response = await ColaboratorService.getRefunds(
      searchParams.toString(),
    )
    setPayments(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  useEffect(() => {
    getRefunds()
  }, [getRefunds])

  const handleConfirmDeletePayment = useCallback(
    async (id: number, status: PaymentStatus) => {
      if (status === PaymentStatus.PAID) {
        toast.error('Reembolso já foi pago, não é possível cancelar')
        return
      } else if (status === PaymentStatus.CANCELLED) {
        toast.error('Reembolso já foi cancelado')
        return
      }
      const deleted = await ColaboratorService.deletePaymentRequest(id)
      if (deleted.data.success) {
        toast.success('Reembolso cancelado com sucesso')
        getRefunds()
      }
    },
    [getRefunds],
  )

  const columns: ColumnDef<RefundResponseDto>[] = [
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
      accessorKey: 'requestDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data" />
      ),
      accessorFn: (row) => format(row.refundDate, 'dd/MM/yyyy'),
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
      accessorKey: 'reason',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Motivo" />
      ),
      accessorFn: (row) => row.reason ?? '--',
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
        const paymentRequest = row.original

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
                    paymentRequest.status === PaymentStatus.PENDING
                      ? navigate(
                          `${COLLABORATOR_PAGES.prefix}/refunds/${paymentRequest.id}/e`,
                        )
                      : toast.error(
                          'Reembolso finalizado, não é possível editar',
                        )
                  }
                  className="group flex items-center gap-2"
                >
                  <Edit size={16} className="text-primary" />
                  <span className="group-hover:text-primary">
                    Editar reembolso
                  </span>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="group flex items-center gap-2">
                    <Trash size={16} className="text-destructive" />
                    <span className="group-hover:text-destructive">
                      Cancelar reembolso
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
                  cancelar esse reembolso?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant={'destructive'}
                    onClick={() =>
                      handleConfirmDeletePayment(
                        paymentRequest.id,
                        paymentRequest.status,
                      )
                    }
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
