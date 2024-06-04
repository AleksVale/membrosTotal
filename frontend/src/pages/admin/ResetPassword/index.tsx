import { BaseHeader } from '@/components/BaseHeader'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { resetPasswordSchema, ResetPasswordType } from './validation'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGoBack } from '@/hooks/useGoBack'
import UserService from '@/services/user.service'
import { toast } from 'react-toastify'
import { ADMIN_PAGES } from '@/utils/constants/routes'
import { useState } from 'react'

export function ResetPassword() {
  const { id } = useParams()
  const { goBack } = useGoBack()
  const navigate = useNavigate()
  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmitForm = async (data: ResetPasswordType) => {
    const response = await UserService.resetPassword(
      id as string,
      data.password,
    )
    if (response.data.success) {
      toast.success('Senha alterada com sucesso')
      navigate(ADMIN_PAGES.listUsers)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev)
  }
  return (
    <>
      <BaseHeader label="Nova senha" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitForm)}
          className="w-full space-y-4"
        >
          <div className="grid grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative flex">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                      />
                      {showPassword ? (
                        <EyeOff
                          className="text-primary absolute right-3 top-2 cursor-pointer"
                          onClick={toggleShowPassword}
                        />
                      ) : (
                        <Eye
                          className="text-primary absolute right-3 top-2 cursor-pointer"
                          onClick={toggleShowPassword}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <div className="relative flex">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...field}
                      />
                      {showConfirmPassword ? (
                        <EyeOff
                          className="text-primary absolute right-3 top-2 cursor-pointer"
                          onClick={toggleShowConfirmPassword}
                        />
                      ) : (
                        <Eye
                          className="text-primary absolute right-3 top-2 cursor-pointer"
                          onClick={toggleShowConfirmPassword}
                        />
                      )}
                    </div>
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
            <Button
              type="submit"
              size={'lg'}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
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
    </>
  )
}
