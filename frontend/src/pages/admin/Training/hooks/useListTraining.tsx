import { PaginationMeta } from '@/services/interfaces'
import TrainingService from '@/services/training.service'
import { ADMIN_PAGES, DEFAULT_META_PAGINATION } from '@/utils/constants/routes'
import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ITraining } from '../interfaces'
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
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/DataTableColumnHeader'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

export function useListTraining() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [training, setTraining] = useState<ITraining[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getTrainings = useCallback(async () => {
    const response = await TrainingService.getTrainings(searchParams)
    setTraining(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  useEffect(() => {
    getTrainings()
  }, [getTrainings])

  const handleDeleteTraining = async (id: number) => {
    try {
      await TrainingService.deleteTraining(id)
      toast.success('Treinamento excluído com sucesso')
      getTrainings()
    } catch (err) {
      toast.error('Erro ao excluir treinamento')
    }
  }

  const columns: ColumnDef<ITraining>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Título" />
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descrição" />
      ),
    },
    {
      accessorKey: 'tutor',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Professor" />
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
        const training = row.original

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
                    navigate(ADMIN_PAGES.editTraining(training.id))
                  }
                  className="group flex items-center gap-2"
                >
                  <Edit size={16} className="text-primary" />
                  <span className="group-hover:text-primary">
                    Editar treinamento
                  </span>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="group flex items-center gap-2">
                    <Trash size={16} className="text-destructive" />
                    <span className="group-hover:text-destructive">
                      Excluir treinamento
                    </span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(ADMIN_PAGES.trainingPermissions(training.id))
                  }
                  className="group flex items-center gap-2"
                >
                  <Edit size={16} className="text-primary-foreground" />
                  <span className="group-hover:text-primary-foreground">
                    Editar permissões
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Você tem certeza?</DialogTitle>
                <DialogDescription>
                  Essa ação não pode ser desfeita. Você tem certeza que deseja
                  apagar esse treinamento e os módulos e submódulos{' '}
                  relacionados?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant={'destructive'}
                    onClick={() => handleDeleteTraining(training.id)}
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

  return { training, meta, columns }
}
