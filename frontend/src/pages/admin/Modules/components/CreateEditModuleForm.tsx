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
import { CreateModuleDTO } from '../validation'
import { useGoBack } from '@/hooks/useGoBack'
import { ThumbnailInput } from '@/components/ThumbnailInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormModule } from '../hooks/useFormModule'

interface CreateEditModuleFormProps {
  form: UseFormReturn<CreateModuleDTO>
  onSubmitForm: (data: CreateModuleDTO) => void
  isSubmitting: boolean
}

export function CreateEditModuleForm({
  form,
  onSubmitForm,
  isSubmitting,
}: Readonly<CreateEditModuleFormProps>) {
  const { goBack } = useGoBack()
  const { trainingOptions } = useFormModule()
  const fileRef = form.register('file')
  const file = form.watch('file')
  let placeholderUrl: string | undefined

  if (file && file[0]) {
    if (typeof file[0] === 'string') {
      placeholderUrl = file[0]
    } else {
      placeholderUrl = URL.createObjectURL(file[0])
    }
  } else {
    placeholderUrl = undefined
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
              name="trainingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treinamento</FormLabel>
                  <FormControl>
                    <Select
                      value={`${field.value}`}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um treinamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trainingOptions.map((training) => (
                          <SelectItem
                            key={training.id}
                            value={`${training.id}`}
                          >
                            {training.label}
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
                  <FormLabel>Descrição do treinamento</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os detalhes do treinamento"
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
