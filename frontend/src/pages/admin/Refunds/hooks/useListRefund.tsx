import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DataTableColumnHeader } from '../../../../components/DataTableColumnHeader'
import { PaginationMeta } from '../../../../services/interfaces'
import { DEFAULT_META_PAGINATION } from '../../../../utils/constants/routes'
import Refundservice from '@/services/refund.service'
import { PaymentLabel, PaymentStatus } from '@/utils/interfaces/payment'
import { IRefund } from '../interface'
import { StatusBadge } from '@/components/StatusBadge'
import PaymentRequestservice from '@/services/paymentRequest.service'
import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'
import { PaymentAdminDialog } from '@/PaymentAdminDialog'

export function useListRefund() {
  const [searchParams] = useSearchParams()
  const [refunds, setRefunds] = useState<IRefund[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getRefunds = useCallback(async () => {
    const response = await Refundservice.getRefunds(searchParams)
    setRefunds(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  const handleConfirmPaidRefund = async (
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
        toast.error('Não é possível pagar um reembolso que não está pendente')
        return
      }
      await Refundservice.finishRefund(id, reason, file)
      getRefunds()
    } catch (error) {
      isAxiosError(error)
        ? toast.error(error.response?.data.message)
        : toast.error('Erro ao confirmar pagamento')
      console.error(error)
    }
  }

  const handleGetSignedURL = async (id: number) => {
    try {
      const response = await PaymentRequestservice.getSignedURL(id)
      window.open(response.data.signedUrl, '_blank')
    } catch (error) {
      console.error(error)
    }
  }

  const handleConfirmDeleteRefund = async (
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
      await Refundservice.cancelRefund(id, cancelReason)
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
      cell: ({ row }) => {
        const original = row.original
        return <StatusBadge status={PaymentLabel[original.status]} />
      },
    },
    {
      accessorKey: 'reason',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descrição" />
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
        const refundRequest = row.original

        return (
          <PaymentAdminDialog
            cancel={handleConfirmDeleteRefund}
            confirmPaidPayment={handleConfirmPaidRefund}
            data={refundRequest}
            downloadFile={handleGetSignedURL}
            type="reembolso"
          />
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
