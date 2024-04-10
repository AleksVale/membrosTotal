import { PaginationMeta } from '@/services/interfaces'
import { ADMIN_PAGES, DEFAULT_META_PAGINATION } from '@/utils/constants/routes'
import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ILesson } from '../interfaces'
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
import LessonService from '@/services/lesson.service'

export function useListLesson() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [lesson, setLesson] = useState<ILesson[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)

  const getLessons = useCallback(async () => {
    const response = await LessonService.getLessons(searchParams)
    setLesson(response.data.data)
    setMeta(response.data.meta)
  }, [searchParams])

  useEffect(() => {
    getLessons()
  }, [getLessons])

  const columns: ColumnDef<ILesson>[] = [
    {
      accessorKey: 'submodule.title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Submódulo" />
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
      accessorKey: 'content',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Link do conteúdo" />
      ),
      cell: ({ row }) => {
        const original = row.original
        return (
          <Button className="p-0" variant={'link'} asChild>
            <Link to={original.content} target="_blank">
              {original.content}
            </Link>
          </Button>
        )
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
        const lesson = row.original

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
                  onClick={() => navigate(ADMIN_PAGES.editLesson(lesson.id))}
                  className="group flex items-center gap-2"
                >
                  <Edit size={16} className="text-primary" />
                  <span className="group-hover:text-primary">Editar aula</span>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="group flex items-center gap-2">
                    <Trash size={16} className="text-destructive" />
                    <span className="group-hover:text-destructive">
                      Excluir aula (será implementado)
                    </span>
                  </DropdownMenuItem>
                </DialogTrigger>
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
                    onClick={() => console.log(lesson.id)}
                  >
                    Excluir
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      },
    },
  ]

  return { lesson, meta, columns }
}
