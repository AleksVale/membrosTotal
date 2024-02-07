import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useCreateMeeting } from './hooks/useCreateMeeting'
import { HeaderMeeting } from '@/components/HeaderMeeting'
import { Textarea } from '@/components/ui/textarea'
import { Autocomplete } from '@/components/ComboBox'
import { DatePicker } from '@/components/ui/date-picker'
import { Helmet } from 'react-helmet-async'

export function CreateMeeting() {
  const { form, isSubmitting, handleSubmitForm, goBack, userOptions } =
    useCreateMeeting()

  return (
    <div>
      <Helmet title="Nova reunião" />
      <HeaderMeeting label="Criar reunião" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="space-y-4 w-full"
        >
          <div className="grid grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da reunião</FormLabel>
                  <FormControl>
                    <Input placeholder="Insira o título" {...field} />
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
                  <FormLabel>Link da reunião</FormLabel>
                  <FormControl>
                    <Input placeholder="Insira o link de acesso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="meetingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <DatePicker
                      {...field}
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      layout="dropdown"
                      minYear={new Date().getFullYear()}
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
              name="users"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuários</FormLabel>
                  <FormControl>
                    <Autocomplete
                      options={userOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
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
                  <FormLabel>Nome da reunião</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o objetivo da reunião"
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
    </div>
  )
}
