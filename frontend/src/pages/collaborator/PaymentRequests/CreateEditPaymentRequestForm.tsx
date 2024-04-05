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
import { CreatePaymentRequestDTO } from './validation'
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
import { useFormPaymentRequest } from './hooks/useFormPaymentRequest'
import { DatePicker } from '@/components/ui/date-picker'

interface CreateEditMeetingFormProps {
  form: UseFormReturn<CreatePaymentRequestDTO>
  onSubmitForm: (data: CreatePaymentRequestDTO) => void
  isSubmitting: boolean
}

export function CreateEditPaymentRequestForm({
  form,
  onSubmitForm,
  isSubmitting,
}: Readonly<CreateEditMeetingFormProps>) {
  const { goBack, paymentRequestTypeOptions } = useFormPaymentRequest()
  const fileRef = form.register('file')
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className="bg-muted m-auto w-2/3 justify-center space-y-4 rounded-lg px-8 py-6"
      >
        <div className="grid grid-cols-1 gap-4">
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
            name="paymentRequestTypeId"
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
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentRequestTypeOptions.map((payment) => (
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
            name="requestDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <DatePicker
                    {...field}
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={field.onChange}
                    layout="dropdown"
                    minYear={new Date().getFullYear() - 1}
                    maxYear={new Date().getFullYear() + 2}
                    showTime
                  />
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
                <FormLabel>Comprovante</FormLabel>
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
                <Loader2 className="mr-2 size-4 animate-spin" />
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
