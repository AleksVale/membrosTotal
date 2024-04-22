import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DataTableColumnHeader } from '../../../../components/DataTableColumnHeader'
import ColaboratorService from '../../../../services/colaborator.service'
import { PaginationMeta } from '../../../../services/interfaces'
import {
  COLLABORATOR_PAGES,
  DEFAULT_META_PAGINATION,
} from '../../../../utils/constants/routes'
import {
  Payment,
  PaymentLabel,
  PaymentStatus,
} from '../../../../utils/interfaces/payment'
import { toast } from 'react-toastify'
import { StatusBadge } from '@/components/StatusBadge'
import { PaymentDialog } from '@/components/PaymentDialog'
import { isAxiosError } from 'axios'

export function useListPaymentCollaborator() {
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
    async (id: number, status: PaymentStatus, cancelReason: string) => {
      try {
        if (status === PaymentStatus.PAID) {
          toast.error('Pagamento já foi pago, não é possível cancelar')
          return
        } else if (status === PaymentStatus.CANCELLED) {
          toast.error('Pagamento já foi cancelado')
          return
        }
        const deleted = await ColaboratorService.deletePayment(id, cancelReason)
        if (deleted.data.success) {
          toast.success('Pagamento cancelado com sucesso')
          getPayments()
        }
      } catch (error) {
        toast.error(
          isAxiosError(error) ? error.message : 'Erro ao cancelar pagamento',
        )
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
          <PaymentDialog
            data={payment}
            cancel={handleConfirmDeletePayment}
            navigateOnEdit={`${COLLABORATOR_PAGES.prefix}/payments/${payment.id}/e`}
            type="pagamento"
          />
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
