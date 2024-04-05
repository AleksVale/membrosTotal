import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { CreatePaymentDTO } from './validation'
import { useFilterPayment } from './hooks/useFilterPayment'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/ui/currency-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface CreateEditMeetingFormProps {
  form: UseFormReturn<CreatePaymentDTO>
  onSubmitForm: (data: CreatePaymentDTO) => void
  isSubmitting: boolean
}

export function CreateEditPaymentForm({
  form,
  onSubmitForm,
  isSubmitting,
}: Readonly<CreateEditMeetingFormProps>) {
  const { goBack, paymentTypeOptions } = useFilterPayment()
  const fileRef = form.register('file')
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className="space-y-4 w-full"
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
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
                <FormLabel>Categoria do pagamento</FormLabel>
                <FormControl>
                  <Select
                    value={`${field.value}`}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentTypeOptions.map((payment) => (
                        <SelectItem key={payment.id} value={`${payment.id}`}>
                          {payment.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel>Arquivo</FormLabel>
                <FormControl>
                  <Input {...fileRef} id="file" type="file" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do pagamento</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva os detalhes do pagamento"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            size={'lg'}
            variant={'secondary'}
            onClick={goBack}
          >
            Cancelar
          </Button>
          <Button type="submit" size={'lg'} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando
              </>
            ) : (
              <span>Cadastrar</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
