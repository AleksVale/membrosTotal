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
import { useFilterPaymentRequest } from './hooks/useFilterPaymentRequest'

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
            className="mb-4 flex items-center gap-1 text-2xl"
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
              className="w-full space-y-4"
            >
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
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
                            {paymentRequestTypeOptions.map((paymentRequest) => (
                              <SelectItem
                                key={paymentRequest.id}
                                value={`${paymentRequest.id}`}
                              >
                                {paymentRequest.label}
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
