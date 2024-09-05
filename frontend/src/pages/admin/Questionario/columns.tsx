import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/DataTableColumnHeader'

import { DEFAULT_META_PAGINATION } from '@/utils/constants/routes'
import { Link, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { PaginationMeta } from '@/services/interfaces'
import { IQuestionario } from './interface'
import ExpertRequestService from '@/services/expert-request.service'
import dayjs from 'dayjs'
import { Button } from '@/components/ui/button'

export function useColumnsQuestionario() {
  const [searchParams] = useSearchParams()
  const [data, setData] = useState<IQuestionario[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)
  const getUsers = useCallback(() => {
    ExpertRequestService.getVideo(searchParams.toString()).then((response) => {
      setData(response.data.data)
      setMeta(response.data.meta)
    })
  }, [searchParams])
  useEffect(() => {
    getUsers()
  }, [getUsers])

  const columns: ColumnDef<IQuestionario>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: 'nome',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome" />
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: 'whatsapp',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="WhatsApp" />
      ),
    },
    {
      accessorKey: 'instagram',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Instagram" />
      ),
    },
    {
      accessorKey: 'experienciaEdicao',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Experiência em Edição" />
      ),
    },
    {
      accessorKey: 'experienciaMotionGraphics',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Experiência em Motion Graphics"
        />
      ),
    },
    {
      accessorKey: 'computador',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Computador" />
      ),
    },
    {
      accessorKey: 'programaEdicao',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Programa de Edição" />
      ),
    },
    {
      accessorKey: 'trabalhosAnteriores',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trabalhos Anteriores" />
      ),
    },
    {
      accessorKey: 'habilidades',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Habilidades" />
      ),
    },
    {
      accessorKey: 'portfolio',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Portfólio" />
      ),
      cell: (row) => (
        <Button asChild variant={'link'}>
          <Link to={row.row.original.portfolio} target="_blank">
            {row.row.original.portfolio}
          </Link>
        </Button>
      ),
    },
    {
      accessorKey: 'disponibilidadeImediata',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Disponibilidade Imediata"
        />
      ),
    },
    {
      accessorKey: 'pretensaoSalarial',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pretensão Salarial" />
      ),
    },
    {
      accessorKey: 'disponibilidadeTempo',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Disponibilidade de Tempo"
        />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Criado em" />
      ),
      accessorFn: (row) => dayjs(row.createdAt).utc(false).format('DD/MM/YYYY'),
    },
  ]

  return {
    columns,
    data,
    meta,
  }
}
