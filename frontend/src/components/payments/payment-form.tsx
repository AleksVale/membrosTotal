'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import http from '@/lib/http'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const paymentSchema = z.object({
  value: z.number().min(0.01, 'Valor deve ser maior que zero'),
  description: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  expertId: z.number().min(1, 'Especialista é obrigatório'),
  paymentTypeId: z.number().min(1, 'Tipo de pagamento é obrigatório'),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

interface PaymentFormProps {
  initialData?: PaymentFormValues
  paymentId?: number
}

export function PaymentForm({ initialData, paymentId }: Readonly<PaymentFormProps>) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [experts, setExperts] = useState<{ id: number; firstName: string; lastName: string }[]>([])
  const [paymentTypes, setPaymentTypes] = useState<{ id: number; name: string }[]>([])

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData || {
      value: 0,
      description: '',
      expertId: 0,
      paymentTypeId: 0,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expertsResponse, paymentTypesResponse] = await Promise.all([
          http.get('/users?profile=EXPERT'),
          http.get('/payment-types'),
        ])
        setExperts(expertsResponse.data)
        setPaymentTypes(paymentTypesResponse.data)
      } catch (error) {
        toast.error('Não foi possível carregar os dados')
      }
    }

    fetchData()
  }, [])

  const onSubmit = async (data: PaymentFormValues) => {
    setLoading(true)
    try {
      if (paymentId) {
        await http.patch(`/payment-admin/${paymentId}`, data)
        toast.success('Pagamento atualizado com sucesso')
      } else {
        await http.post('/payment-admin', data)
        toast.success('Pagamento criado com sucesso')
      }
      router.push('/admin/payments')
    } catch (error) {
      toast.error('Não foi possível salvar o pagamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Pagamento</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de pagamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expertId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especialista</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o especialista" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {experts.map((expert) => (
                    <SelectItem key={expert.id} value={expert.id.toString()}>
                      {expert.firstName} {expert.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 