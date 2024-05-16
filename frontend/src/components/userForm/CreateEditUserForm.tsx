import { MaskitoOptions } from '@maskito/core'
import { useMaskito } from '@maskito/react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { DatePicker } from '../ui/date-picker'
import { UseFormReturn } from 'react-hook-form'
import { CreateUserForm } from '@/pages/admin/User/interfaces'
import { useCreateEditUserForm } from './useCreateEditUserForm'

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
interface CreateEditUserFormProps {
  form: UseFormReturn<CreateUserForm>
  onSubmitForm: (data: CreateUserForm) => void
  isSubmitting: boolean
  isEdit?: boolean
}

export function CreateEditUserForm({
  form,
  onSubmitForm,
  isSubmitting,
  isEdit = false,
}: Readonly<CreateEditUserFormProps>) {
  const documentRef = useMaskito({ options: doocumentMask })

  const phoneRef = useMaskito({ options: phoneMask })

  const { goBack, profileOptions } = useCreateEditUserForm()
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className="w-full space-y-4"
      >
        <div className="grid grid-cols-4 gap-4">
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
          {!isEdit && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Insira a senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
                    selected={field.value ? new Date(field.value) : undefined}
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
            name="profileId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil</FormLabel>
                <FormControl>
                  <Select
                    value={`${field.value}`}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {profileOptions.map((profile) => (
                        <SelectItem key={profile.id} value={`${profile.id}`}>
                          {profile.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <span>Cadastrar</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
