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
  RefundResponseDto,
} from '../../../../utils/interfaces/payment'

export function useListPaymentRequestCollaborator() {
  const [searchParams] = useSearchParams()
  const [payments, setPayments] = useState<RefundResponseDto[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getPaymentRequests = useCallback(async () => {
    const response = await ColaboratorService.getRefunds(
      searchParams.toString(),
    )
    setPayments(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  useEffect(() => {
    getPaymentRequests()
  }, [getPaymentRequests])

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
      accessorFn: (row) => format(row.refundDate, 'dd/MM/yyyy'),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      accessorFn: (row) => PaymentLabel[row.status],
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
  ]
  return {
    columns,
    payments,
    meta,
  }
}
