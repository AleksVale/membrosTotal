import { PaginationMeta } from '@/services/interfaces'
import { ADMIN_PAGES, DEFAULT_META_PAGINATION } from '@/utils/constants/routes'
import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { IModule } from '../interfaces'
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
import ModuleService from '@/services/module.service'
import { toast } from 'react-toastify'

export function useListModule() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [module, setModule] = useState<IModule[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getModules = useCallback(async () => {
    const response = await ModuleService.getModules(searchParams)
    setModule(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  const handleDeleteModule = async (id: number) => {
    try {
      await ModuleService.deleteModule(id)
      toast.success('Módulo excluído com sucesso')
      getModules()
    } catch (err) {
      toast.error('Erro ao excluir módulo')
    }
  }

  useEffect(() => {
    getModules()
  }, [getModules])

  const columns: ColumnDef<IModule>[] = [
    {
      accessorKey: 'order',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ordem" />
      ),
    },
    {
      accessorKey: 'training.title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Treinamento" />
      ),
    },
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
        const module = row.original

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
                  onClick={() => navigate(ADMIN_PAGES.editModule(module.id))}
                  className="group flex items-center gap-2"
                >
                  <Edit size={16} className="text-primary" />
                  <span className="group-hover:text-primary">
                    Editar módulo
                  </span>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="group flex items-center gap-2">
                    <Trash size={16} className="text-destructive" />
                    <span className="group-hover:text-destructive">
                      Excluir módulo
                    </span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(ADMIN_PAGES.modulesPermissions(module.id))
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
                  apagar esse módulo e os submódulos relacionados?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant={'destructive'}
                    onClick={() => handleDeleteModule(module.id)}
                  >
                    Deletar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      },
    },
  ]

  return { module, meta, columns }
}
