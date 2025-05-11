'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentForm } from '@/components/payments/payment-form'

export default function NewPaymentPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <PaymentForm />
      </CardContent>
    </Card>
  )
} 