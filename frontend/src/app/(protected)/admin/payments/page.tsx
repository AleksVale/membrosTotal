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
import { DollarSign, MoreHorizontal, Search } from 'lucide-react'
import http from '@/lib/http'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Payment {
  id: number
  description: string
  value: number
  status: string
  createdAt: string
  updatedAt: string
  paymentType: {
    id: number
    name: string
  }
  user: {
    id: number
    firstName: string
    lastName: string
  }
}

export default function PaymentsPage() {
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPayments = async () => {
    try {
      const response = await http.get('/payment-admin', {
        params: {
          page,
          per_page: 10,
          description: search,
        },
      })
      setPayments(response.data.data)
      setTotalPages(Math.ceil(response.data.meta.total / response.data.meta.per_page))
    } catch {
      toast.error('Não foi possível carregar os pagamentos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await http.delete(`/payment-admin/${id}`)
      toast.success('Pagamento removido com sucesso')
      fetchPayments()
    } catch {
      toast.error('Não foi possível remover o pagamento')
    }
  }

  const handlePay = async (id: number) => {
    try {
      await http.patch(`/payment-admin/${id}/pay`)
      toast.success('Pagamento realizado com sucesso')
      fetchPayments()
    } catch {
      toast.error('Não foi possível realizar o pagamento')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os pagamentos do sistema
          </p>
        </div>
        <Button onClick={() => router.push('/admin/payments/new')}>
          <DollarSign className="mr-2 h-4 w-4" />
          Novo Pagamento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagamentos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os pagamentos do sistema
          </CardDescription>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pagamentos..."
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
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(payment.value)}
                  </TableCell>
                  <TableCell>
                    {payment.user.firstName} {payment.user.lastName}
                  </TableCell>
                  <TableCell>{payment.paymentType.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === 'PAID'
                          ? 'default'
                          : payment.status === 'CANCELLED'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {payment.status === 'PAID'
                        ? 'Pago'
                        : payment.status === 'CANCELLED'
                        ? 'Cancelado'
                        : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(payment.createdAt), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
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
                          onClick={() => router.push(`/admin/payments/${payment.id}/edit`)}
                        >
                          Editar
                        </DropdownMenuItem>
                        {payment.status === 'PENDING' && (
                          <DropdownMenuItem
                            onClick={() => handlePay(payment.id)}
                          >
                            Realizar Pagamento
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(payment.id)}
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