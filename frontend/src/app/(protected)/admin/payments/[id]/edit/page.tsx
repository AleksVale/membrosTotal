'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentForm } from '@/components/payments/payment-form'
import http from '@/lib/http'
import { toast } from 'react-toastify'

interface Payment {
  id: number
  value: number
  description: string
  expertId: number
  paymentTypeId: number
}

export default function EditPaymentPage() {
  const params = useParams()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await http.get(`/payment-admin/${params.id}`)
        setPayment(response.data)
      } catch (error) {
        toast.error('Não foi possível carregar os dados do pagamento')
      } finally {
        setLoading(false)
      }
    }

    fetchPayment()
  }, [params.id])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!payment) {
    return <div>Pagamento não encontrado</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <PaymentForm initialData={payment} paymentId={payment.id} />
      </CardContent>
    </Card>
  )
} 