import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DataTableColumnHeader } from '../../../../components/DataTableColumnHeader'
import ColaboratorService from '../../../../services/colaborator.service'
import { PaginationMeta } from '../../../../services/interfaces'
import { DEFAULT_META_PAGINATION } from '../../../../utils/constants/routes'
import {
  PaymentLabel,
  PaymentResponseDto,
  PaymentStatus,
} from '../../../../utils/interfaces/payment'
import { toast } from 'react-toastify'
import { StatusBadge } from '@/components/StatusBadge'
import { PaymentDialog } from '@/components/PaymentDialog'

export function useListPaymentRequestCollaborator() {
  const [searchParams] = useSearchParams()
  const [payments, setPayments] = useState<PaymentResponseDto[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getPaymentRequests = useCallback(async () => {
    const response = await ColaboratorService.getPaymentRequests(
      searchParams.toString(),
    )
    setPayments(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  useEffect(() => {
    getPaymentRequests()
  }, [getPaymentRequests])

  const handleConfirmDeletePayment = useCallback(
    async (id: number, status: PaymentStatus, cancelReason: string) => {
      if (status === PaymentStatus.PAID) {
        toast.error('Solicitação já foi paga, não é possível cancelar')
        return
      } else if (status === PaymentStatus.CANCELLED) {
        toast.error('Solicitação já foi cancelada')
        return
      }
      const deleted = await ColaboratorService.deletePaymentRequest(
        id,
        cancelReason,
      )
      if (deleted.data.success) {
        toast.success('Solicitação cancelada com sucesso')
        getPaymentRequests()
      }
    },
    [getPaymentRequests],
  )

  const columns: ColumnDef<PaymentResponseDto>[] = [
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
      accessorKey: 'PaymentRequestType.label',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoria" />
      ),
    },
    {
      accessorKey: 'requestDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data" />
      ),
      accessorFn: (row) => format(row.requestDate, 'dd/MM/yyyy'),
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
            navigateOnEdit={`/collaborator/payment_requests/${paymentRequest.id}/e`}
            type="solicitação de compra"
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
