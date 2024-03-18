import { ChevronDown, ChevronRight } from 'lucide-react'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useFilterPaymentRequest } from './hooks/useFilterPayment'

export default function FilterPaymentRequest() {
  const {
    isOpen,
    setIsOpen,
    form,
    handleSubmitForm,
    handleClearFilter,
    paymentRequestTypeOptions,
  } = useFilterPaymentRequest()
  return (
    <section className="py-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            className="flex items-center justify-start pl-0 text-2xl gap-1 mb-4"
            variant={'ghost'}
          >
            Filtros{' '}
            {isOpen ? <ChevronDown size={26} /> : <ChevronRight size={26} />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitForm)}
              className="space-y-4 w-full"
            >
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="paymentRequestTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentRequestTypeOptions.map((payment) => (
                              <SelectItem
                                key={payment.id}
                                value={`${payment.id}`}
                              >
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
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={handleClearFilter}
                  size={'default'}
                >
                  Limpar filtros
                </Button>
                <Button type="submit" size={'default'}>
                  Filtrar
                </Button>
              </div>
            </form>
          </Form>
        </CollapsibleContent>
      </Collapsible>
    </section>
  )
}
