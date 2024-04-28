import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DataTableColumnHeader } from '../../../../components/DataTableColumnHeader'
import { PaginationMeta } from '../../../../services/interfaces'
import { DEFAULT_META_PAGINATION } from '../../../../utils/constants/routes'
import {
  Payment,
  PaymentLabel,
  PaymentStatus,
} from '../../../../utils/interfaces/payment'
import Paymentservice from '@/services/payment.service'
import { StatusBadge } from '@/components/StatusBadge'
import { PaymentAdminDialog } from '@/PaymentAdminDialog'
import { toast } from 'react-toastify'
import { isAxiosError } from 'axios'

export function useListPayment() {
  const [searchParams] = useSearchParams()
  const [payments, setPayments] = useState<Payment[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getPayments = useCallback(async () => {
    const response = await Paymentservice.getPayments(searchParams)
    setPayments(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  const handleConfirmPaidPayment = async (
    id: number,
    status: PaymentStatus,
    reason: string,
    file: File,
  ) => {
    try {
      if (!file) {
        toast.error('É necessário enviar um comprovante')
        return
      }
      if (status !== PaymentStatus.PENDING) {
        toast.error(
          'Não é possível confirmar um pagamento que não está pendente',
        )
        return
      }
      await Paymentservice.finishPayment(id, reason, file)
      getPayments()
    } catch (error) {
      isAxiosError(error)
        ? toast.error(error.response?.data.message)
        : toast.error('Erro ao confirmar pagamento')
      console.error(error)
    }
  }

  const handleGetSignedURL = async (id: number) => {
    try {
      const response = await Paymentservice.getSignedURL(id)
      window.open(response.data.signedUrl, '_blank')
    } catch (error) {
      console.error(error)
    }
  }

  const handleConfirmDeletePayment = async (
    id: number,
    status: PaymentStatus,
    cancelReason: string,
  ) => {
    try {
      if (status !== PaymentStatus.PENDING) {
        toast.error(
          'Não é possível cancelar um pagamento que não está pendente',
        )
        return
      }
      await Paymentservice.cancelPayment(id, cancelReason)
      getPayments()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getPayments()
  }, [getPayments])

  const columns: ColumnDef<Payment>[] = [
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
      accessorKey: 'User.pixKey',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="PIX" />
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
      accessorKey: 'reason',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Motivo" />
      ),
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
          <PaymentAdminDialog
            cancel={handleConfirmDeletePayment}
            confirmPaidPayment={handleConfirmPaidPayment}
            data={paymentRequest}
            downloadFile={handleGetSignedURL}
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
