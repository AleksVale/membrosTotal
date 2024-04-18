// import { Button } from '@/components/ui/button'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import { useGoBack } from '@/hooks/useGoBack'
// import { Loader2 } from 'lucide-react'
// import { Autocomplete } from '@/components/ComboBox'
import { Helmet } from 'react-helmet-async'
import { BaseHeader } from '@/components/BaseHeader'
// import { useModulePermission } from './hooks/useModulePermission'

export function ModulesPermission() {
  // const { modules, users, form, isSubmitting, onSubmitForm } =
  //   useModulePermission()
  // const { goBack } = useGoBack()
  return (
    <div>
      <Helmet title="Adicionar permissões" />
      <BaseHeader label="Adicionar permissões" />
      {/* <Form {...form}>
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
              name="modules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Módulos</FormLabel>
                  <FormControl>
                    <Autocomplete
                      options={modules}
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
                <span>Salvar</span>
              )}
            </Button>
          </div>
        </form>
      </Form> */}
    </div>
  )
}
