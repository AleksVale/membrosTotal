'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Calendar, MoreHorizontal, Search, Video } from 'lucide-react'
import http from '@/lib/http'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Meeting {
  id: number
  title: string
  description: string
  date: string
  link: string
  status: string
  UserMeeting: {
    User: {
      id: number
      firstName: string
      lastName: string
    }
  }[]
}

export default function MeetingsPage() {
  const router = useRouter()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchMeetings = async () => {
    try {
      const response = await http.get('/meetings', {
        params: {
          page,
          per_page: 10,
          title: search,
        },
      })
      setMeetings(response.data.data)
      setTotalPages(Math.ceil(response.data.meta.total / response.data.meta.per_page))
    } catch {
      toast.error('Não foi possível carregar as reuniões')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await http.delete(`/meetings/${id}`)
      toast.success('Reunião removida com sucesso')
      fetchMeetings()
    } catch {
      toast.error('Não foi possível remover a reunião')
    }
  }

  const handleFinish = async (id: number) => {
    try {
      await http.patch(`/meetings/${id}/finish`)
      toast.success('Reunião finalizada com sucesso')
      fetchMeetings()
    } catch {
      toast.error('Não foi possível finalizar a reunião')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reuniões</h1>
          <p className="text-muted-foreground">
            Gerencie as reuniões do sistema
          </p>
        </div>
        <Button onClick={() => router.push('/admin/meetings/new')}>
          <Video className="mr-2 h-4 w-4" />
          Nova Reunião
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Reuniões</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as reuniões do sistema
          </CardDescription>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar reuniões..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Participantes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <p className="font-medium">{meeting.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {meeting.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(meeting.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {meeting.UserMeeting.map((userMeeting) => (
                        <span key={userMeeting.User.id}>
                          {userMeeting.User.firstName} {userMeeting.User.lastName}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        meeting.status === 'DONE'
                          ? 'default'
                          : meeting.status === 'CANCELED'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {meeting.status === 'DONE'
                        ? 'Finalizada'
                        : meeting.status === 'CANCELED'
                        ? 'Cancelada'
                        : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/meetings/${meeting.id}`)}
                        >
                          Editar
                        </DropdownMenuItem>
                        {meeting.status === 'PENDING' && (
                          <DropdownMenuItem
                            onClick={() => handleFinish(meeting.id)}
                          >
                            Finalizar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(meeting.id)}
                          className="text-red-600"
                        >
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 