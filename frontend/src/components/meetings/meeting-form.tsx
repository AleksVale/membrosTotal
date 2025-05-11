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
import { useState } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

const meetingSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  link: z.string().url('Link deve ser uma URL válida'),
  meetingDate: z.string().min(1, 'Data é obrigatória'),
  users: z.array(z.number()).min(1, 'Selecione pelo menos um participante'),
})

type MeetingFormValues = z.infer<typeof meetingSchema>

interface MeetingFormProps {
  initialData?: MeetingFormValues
  meetingId?: number
}

export function MeetingForm({ initialData, meetingId }: Readonly<MeetingFormProps>) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<{ id: number; firstName: string; lastName: string }[]>([])

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      link: '',
      meetingDate: '',
      users: [],
    },
  })

  const onSubmit = async (data: MeetingFormValues) => {
    setLoading(true)
    try {
      if (meetingId) {
        await http.patch(`/meetings/${meetingId}`, data)
        toast.success('Reunião atualizada com sucesso')
      } else {
        await http.post('/meetings', data)
        toast.success('Reunião criada com sucesso')
      }
      router.push('/admin/meetings')
    } catch (error) {
      toast.error('Não foi possível salvar a reunião')
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link da Reunião</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="meetingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data e Hora</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="users"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Participantes</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange([...field.value, parseInt(value)])}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione os participantes" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.firstName} {user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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