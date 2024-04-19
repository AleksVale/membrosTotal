import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { CreatePermission } from './validation'
import { Autocomplete } from '@/services/autocomplete.service'
import { UseFormReturn } from 'react-hook-form'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'

interface IPermissionFormProps {
  title: string
  type: 'treinamento' | 'submódulo' | 'módulo'
  users: Autocomplete[]
  isSubmitting: boolean
  onSubmitForm: (data: CreatePermission) => void
  goBack: () => void
  form: UseFormReturn<CreatePermission>
}

export function PermissionForm({
  form,
  goBack,
  isSubmitting,
  onSubmitForm,
  title,
  type,
  users,
}: Readonly<IPermissionFormProps>) {
  const renderSwitchDescription = () => {
    switch (type) {
      case 'treinamento':
        return 'Adicionar permissões aos módulos e submódulos relacionados ao treinamento.'
      case 'submódulo':
        return 'Adicionar permissões treinamentos e módulos relacionados ao submódulo.'
      case 'módulo':
        return 'Adicionar permissões aos treinamentos e módulos relacionados ao módulo.'
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className="w-full space-y-4"
      >
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="users"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">{title}</FormLabel>
                  <FormDescription>
                    Selecione os usuários que terão acesso a este {type}
                  </FormDescription>
                </div>
                {users.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="users"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.some(
                                (value) => value === item.id,
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id,
                                      ),
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.fullName}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addRelatives"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{title}</FormLabel>
                  <FormDescription>{renderSwitchDescription()}</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
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
    </Form>
  )
}
