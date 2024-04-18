import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DataTableColumnHeader } from '../../../../components/DataTableColumnHeader'
import { PaginationMeta } from '../../../../services/interfaces'
import { DEFAULT_META_PAGINATION } from '../../../../utils/constants/routes'
import { Payment, PaymentLabel } from '../../../../utils/interfaces/payment'
import Paymentservice from '@/services/payment.service'
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
import { MoreHorizontal, Trash, CheckSquare, DownloadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'

export function useListPayment() {
  const [searchParams] = useSearchParams()
  const [payments, setPayments] = useState<Payment[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getPayments = useCallback(async () => {
    const response = await Paymentservice.getPayments(searchParams)
    setPayments(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  const handleConfirmPaidPayment = async (id: number) => {
    try {
      await Paymentservice.finishPayment(id)
      getPayments()
    } catch (error) {
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

  const handleConfirmDeletePayment = async (id: number) => {
    try {
      await Paymentservice.cancelPayment(id)
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
                  onClick={() => handleConfirmPaidPayment(paymentRequest.id)}
                  className="group flex items-center gap-2"
                >
                  <CheckSquare size={16} className="text-green-300" />
                  <span className="group-hover:text-green-300">
                    Confirmar pagamento
                  </span>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="group flex items-center gap-2">
                    <Trash size={16} className="text-destructive" />
                    <span className="group-hover:text-destructive">
                      Negar pagamento
                    </span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem
                  onClick={() => handleGetSignedURL(paymentRequest.id)}
                  className="group flex items-center gap-2"
                >
                  <DownloadCloud size={16} className="text-green-300" />
                  <span className="group-hover:text-green-300">
                    Ver comprovante
                  </span>
                </DropdownMenuItem>
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
                    onClick={() =>
                      handleConfirmDeletePayment(paymentRequest.id)
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
