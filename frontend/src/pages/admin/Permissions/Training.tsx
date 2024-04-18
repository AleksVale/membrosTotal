import { Button } from '@/components/ui/button'
import { useTrainingPermission } from './hooks/useTrainingPermission'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useGoBack } from '@/hooks/useGoBack'
import { Loader2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { BaseHeader } from '@/components/BaseHeader'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'

export function TrainingPermissions() {
  const { training, users, form, isSubmitting, onSubmitForm } =
    useTrainingPermission()
  const { goBack } = useGoBack()
  return (
    <div>
      <Helmet title="Adicionar permissões" />
      <BaseHeader label={`Adicionar permissões ${training?.title}`} />

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
                    <FormLabel className="text-base">
                      {training?.title}
                    </FormLabel>
                    <FormDescription>
                      Selecione os usuários que terão acesso a este treinamento
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
                    <FormLabel className="text-base">
                      {training?.title}
                    </FormLabel>
                    <FormDescription>
                      Adicionar permissões aos módulos e submódulos relacionados
                      ao treinamento.
                    </FormDescription>
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
    </div>
  )
}
