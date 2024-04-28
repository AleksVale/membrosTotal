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
import { CreateTrainingDTO } from '../validation'
import { useGoBack } from '@/hooks/useGoBack'
import { ThumbnailInput } from '@/components/ThumbnailInput'

interface CreateEditTrainingFormProps {
  form: UseFormReturn<CreateTrainingDTO>
  onSubmitForm: (data: CreateTrainingDTO) => void
  isSubmitting: boolean
}

export function CreateEditTrainingForm({
  form,
  onSubmitForm,
  isSubmitting,
}: Readonly<CreateEditTrainingFormProps>) {
  const { goBack } = useGoBack()
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
              name="tutor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professor</FormLabel>
                  <FormControl>
                    <Input placeholder="Insira o professor" {...field} />
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
