import { DataTableColumnHeader } from '@/components/DataTableColumnHeader'
import { NotificationResponseDTO } from '@/services/home.service'
import { PaginationMeta } from '@/services/interfaces'
import NotificationService from '@/services/notification.service'
import { DEFAULT_META_PAGINATION } from '@/utils/constants/routes'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useListNotification() {
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>(
    [],
  )
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META_PAGINATION)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    async function fetchNotifications() {
      const response = await NotificationService.getNotification(searchParams)
      setNotifications(response.data.data)
      setMeta(response.data.meta)
    }

    fetchNotifications()
  }, [searchParams])

  const columns: ColumnDef<NotificationResponseDTO>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Título" />
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mensagem" />
      ),
    },
    {
      id: 'read',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lido por" />
      ),
      cell: ({ row }) => {
        const notification = row.original
        const readBy = notification.NotificationUser.filter(
          (notificationUser) => notificationUser.read,
        ).map(
          (notificationUser) =>
            `${notificationUser.User.firstName} ${notificationUser.User.lastName} \n`,
        )
        return (
          <div>
            {readBy.length > 0 ? (
              readBy
            ) : (
              <p className="text-red-500">Ninguém leu ainda</p>
            )}
          </div>
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
  ]

  return { notifications, meta, columns }
}
