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
import { CreateLessonDTO } from '../validation'
import { useGoBack } from '@/hooks/useGoBack'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormLesson } from '../hooks/useFormLesson'

interface CreateEditLessonFormProps {
  form: UseFormReturn<CreateLessonDTO>
  onSubmitForm: (data: CreateLessonDTO) => void
  isSubmitting: boolean
}

export function CreateEditLessonForm({
  form,
  onSubmitForm,
  isSubmitting,
}: Readonly<CreateEditLessonFormProps>) {
  const { goBack } = useGoBack()
  const { subModules } = useFormLesson()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className="flex w-full space-x-6"
      >
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo</FormLabel>
                  <FormControl>
                    <Input placeholder="Insira o link do conteúdo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="submoduleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Submódulo</FormLabel>
                  <FormControl>
                    <Select
                      value={`${field.value}`}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um submódulo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subModules.map((submodule) => (
                          <SelectItem
                            key={submodule.id}
                            value={`${submodule.id}`}
                          >
                            {submodule.label}
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
                  <FormLabel>Descrição da aula</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os detalhes da aula"
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
