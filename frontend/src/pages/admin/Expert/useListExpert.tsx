import { DataTableColumnHeader } from '@/components/DataTableColumnHeader'
import ExpertRequestService, {
  ExpertResponse,
} from '@/services/expert-request.service'
import { PaginationMeta } from '@/services/interfaces'
import { DEFAULT_META_PAGINATION } from '@/utils/constants/routes'
import { ColumnDef } from '@tanstack/react-table'
import { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, View } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { RequestModalItem } from '@/components/RequestModalItem'
import { englishToPortugueseMapping } from '@/utils/constants/general'

export function useListExpert() {
  const [experts, setExperts] = useState<ExpertResponse[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const fetchExperts = useCallback(async () => {
    try {
      const response = await ExpertRequestService.get('')
      setExperts(response.data.data)
      setMeta(response.data.meta)
    } catch (error) {
      toast.error('Erro ao buscar os especialistas')
      console.error(error)
    }
  }, [])

  useEffect(() => {
    fetchExperts()
  }, [fetchExperts])

  const renderDialogContent = (request: ExpertResponse) => {
    return (
      <DialogContent>
        <DialogHeader>Descrição da solicitação</DialogHeader>
        <DialogTitle>Instagram: {request.instagram}</DialogTitle>
        <div className="grid w-full grid-cols-1 justify-between">
          {Object.entries(request).map(([key, value]) => (
            <RequestModalItem
              key={key}
              title={key as keyof typeof englishToPortugueseMapping}
              description={value}
            />
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'secondary'}>Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    )
  }

  const expertColumns: ColumnDef<ExpertResponse>[] = [
    {
      accessorKey: 'instagram',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Instagram" />
      ),
      cell: ({ row }) => <span>{row.original.instagram}</span>,
    },
    {
      accessorKey: 'youtube',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="YouTube" />
      ),
      cell: ({ row }) => (
        <Button asChild variant={'link'}>
          <Link to={row.original.youtube ?? ''}>
            {row.original.youtube ?? '--'}
          </Link>
        </Button>
      ),
    },
    {
      accessorKey: 'hasProduct',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Possui Produto" />
      ),
    },
    {
      accessorKey: 'invoiced',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Faturado" />
      ),
    },
    {
      accessorKey: 'budget',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Orçamento" />
      ),
    },
    {
      accessorKey: 'compromised',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comprometido" />
      ),
      cell: ({ row }) => <span>{row.original.compromised}</span>,
    },
    {
      accessorKey: 'whatsapp',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="WhatsApp" />
      ),
      cell: ({ row }) => <span>{row.original.whatsapp}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Criado em" />
      ),
      accessorFn: (row) => format(row.createdAt, 'dd/MM/yyyy'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const request = row.original

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
                <DialogTrigger asChild>
                  <DropdownMenuItem className="group flex items-center gap-2">
                    <View size={16} className="text-primary" />
                    <span className="group-hover:text-primary">
                      Ver detalhes
                    </span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
            {renderDialogContent(request)}
          </Dialog>
        )
      },
    },
  ]

  return { experts, meta, expertColumns }
}
