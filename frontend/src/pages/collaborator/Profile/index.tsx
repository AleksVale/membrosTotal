import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MaskitoOptions } from '@maskito/core'
import { useMaskito } from '@maskito/react'
import { Loader2, Pencil } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useColaboratorProfile } from './useColaboratorProfile'

const doocumentMask: MaskitoOptions = {
  mask: [
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ],
}

const phoneMask: MaskitoOptions = {
  mask: [
    '(',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
}

export function Profile() {
  const documentRef = useMaskito({ options: doocumentMask })
  const {
    form,
    handleSubmitForm,
    isSubmitting,
    goBack,
    editing,
    handleToggleEditing,
  } = useColaboratorProfile()

  const phoneRef = useMaskito({ options: phoneMask })
  return (
    <div>
      <Helmet title="Meu perfil" />
      <section className="mb-6 flex justify-between">
        <h1 className="text-3xl">Meu Perfil</h1>

        <Button
          variant={'default'}
          onClick={handleToggleEditing}
          className="flex gap-2"
        >
          Editar <Pencil size={20} />
        </Button>
      </section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="bg-muted m-auto w-11/12 justify-center space-y-4 rounded-lg px-8 py-6"
        >
          <fieldset disabled={!editing} className="w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira o telefone"
                        {...field}
                        ref={phoneRef}
                        onInput={(evt) => {
                          form.setValue('phone', evt.currentTarget.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira o documento"
                        {...field}
                        ref={documentRef}
                        onInput={(evt) => {
                          form.setValue('document', evt.currentTarget.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de nascimento</FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={field.onChange}
                        layout="dropdown"
                        maxYear={new Date().getFullYear() - 18}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o instagram" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pixKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pix</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o pix" {...field} />
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
          </fieldset>
        </form>
      </Form>
    </div>
  )
}
