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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateSubModuleDTO } from '../validation'
import { useGoBack } from '@/hooks/useGoBack'
import { ThumbnailInput } from '@/components/ThumbnailInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormSubModule } from '../hooks/useFormSubModule'

interface CreateEditModuleFormProps {
  form: UseFormReturn<CreateSubModuleDTO>
  onSubmitForm: (data: CreateSubModuleDTO) => void
  isSubmitting: boolean
}

export function CreateEditSubModuleForm({
  form,
  onSubmitForm,
  isSubmitting,
}: Readonly<CreateEditModuleFormProps>) {
  const { goBack } = useGoBack()
  const { moduleOptions } = useFormSubModule()
  const fileRef = form.register('file')
  const file = form.watch('file')
  let placeholderUrl: string | undefined

  if (file?.[0]) {
    if (typeof file[0] === 'string') {
      placeholderUrl = file[0]
    } else {
      placeholderUrl = URL.createObjectURL(file[0])
    }
  } else {
    placeholderUrl = undefined
  }

  if (moduleOptions.length === 0) {
    return <Loader2 className="size-4 animate-spin" />
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className="flex w-full space-x-6"
      >
        <div className="flex items-center justify-center">
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel>Thumbnail</FormLabel>
                <FormControl>
                  <ThumbnailInput
                    {...fileRef}
                    id="imageUpload"
                    placeholder={placeholderUrl}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 space-y-6 pb-6 lg:grid-cols-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Insira o título" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Insira a ordem de exibição"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moduleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Módulo</FormLabel>
                  <FormControl>
                    <Select
                      value={`${field.value}`}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um módulo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {moduleOptions.map((module) => (
                          <SelectItem key={module.id} value={`${module.id}`}>
                            {module.label}
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
          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do submódulo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os detalhes do submódulo"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              size={'lg'}
              variant={'secondary'}
              onClick={goBack}
            >
              Voltar
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
        </div>
      </form>
    </Form>
  )
}
