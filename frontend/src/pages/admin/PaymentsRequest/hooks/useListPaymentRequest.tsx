import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DataTableColumnHeader } from '../../../../components/DataTableColumnHeader'
import { PaginationMeta } from '../../../../services/interfaces'
import {
  ADMIN_PAGES,
  DEFAULT_META_PAGINATION,
} from '../../../../utils/constants/routes'

import PaymentRequestservice from '@/services/paymentRequest.service'
import { PaymentLabel, PaymentStatus } from '@/utils/interfaces/payment'
import { IPaymentRequest } from '../interface'
import { StatusBadge } from '@/components/StatusBadge'
import { PaymentAdminDialog } from '@/PaymentAdminDialog'
import { toast } from 'react-toastify'
import { isAxiosError } from 'axios'

export function useListPaymentRequest() {
  const [searchParams] = useSearchParams()
  const [paymentRequests, setPaymentRequests] = useState<IPaymentRequest[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getPaymentRequests = useCallback(async () => {
    const response =
      await PaymentRequestservice.getPaymentRequests(searchParams)
    setPaymentRequests(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  const handleConfirmPaidPaymentRequest = async (
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
      await PaymentRequestservice.finishPaymentRequest(id, reason, file)
      getPaymentRequests()
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

  const handleConfirmDeletePaymentRequest = async (
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
      await PaymentRequestservice.cancelPaymentRequest(id, cancelReason)
      getPaymentRequests()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getPaymentRequests()
  }, [getPaymentRequests])

  const columns: ColumnDef<IPaymentRequest>[] = [
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
      accessorKey: 'PaymentRequestType.label',
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
        const paymentRequestRequest = row.original

        return (
          <PaymentAdminDialog
            cancel={handleConfirmDeletePaymentRequest}
            confirmPaidPayment={handleConfirmPaidPaymentRequest}
            data={paymentRequestRequest}
            navigateOnEdit={ADMIN_PAGES.listPaymentRequest}
            downloadFile={handleGetSignedURL}
            type="solicitação de compra"
          />
        )
      },
    },
  ]
  return {
    columns,
    paymentRequests,
    meta,
  }
}
