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
  PaymentLabel,
  PaymentStatus,
  RefundResponseDto,
} from '../../../../utils/interfaces/payment'

import { toast } from 'react-toastify'
import { StatusBadge } from '@/components/StatusBadge'
import { PaymentDialog } from '@/components/PaymentDialog'

export function useListPaymentRequestCollaborator() {
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
    async (id: number, status: PaymentStatus, cancelReason: string) => {
      if (status === PaymentStatus.PAID) {
        toast.error('Reembolso já foi pago, não é possível cancelar')
        return
      } else if (status === PaymentStatus.CANCELLED) {
        toast.error('Reembolso já foi cancelado')
        return
      }
      const deleted = await ColaboratorService.deleteRefund(id, cancelReason)
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
          <PaymentDialog
            data={paymentRequest}
            cancel={handleConfirmDeletePayment}
            navigateOnEdit={`${COLLABORATOR_PAGES.prefix}/refunds/${paymentRequest.id}/e`}
            type="reembolso"
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
