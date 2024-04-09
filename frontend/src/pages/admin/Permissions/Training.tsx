import { Button } from '@/components/ui/button'
import { useTrainingPermission } from './hooks/useTrainingPermission'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useGoBack } from '@/hooks/useGoBack'
import { Loader2 } from 'lucide-react'
import { Autocomplete } from '@/components/ComboBox'
import { Helmet } from 'react-helmet-async'
import { BaseHeader } from '@/components/BaseHeader'

export function TrainingPermissions() {
  const { trainings, users, form, isSubmitting, onSubmitForm } =
    useTrainingPermission()
  const { goBack } = useGoBack()
  return (
    <div>
      <Helmet title="Adicionar permissões" />
      <BaseHeader label="Adicionar permissões" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitForm)}
          className="w-full space-y-4"
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="users"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuários</FormLabel>
                  <FormControl>
                    <Autocomplete
                      options={users}
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
              name="trainings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treinamentos</FormLabel>
                  <FormControl>
                    <Autocomplete
                      options={trainings}
                      value={field.value}
                      onChange={field.onChange}
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
    </div>
  )
}
