import { Helmet } from 'react-helmet-async'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Profile } from '@/utils/constants/profiles'
import { ADMIN_PAGES, COLLABORATOR_PAGES } from '@/utils/constants/routes'
import { toast } from 'react-toastify'
import { LoginForm, LoginSchema } from './validation'

export function Login() {
  const navigate = useNavigate()
  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)

  const { isSubmitting } = form.formState

  async function onSubmit(values: LoginForm) {
    try {
      const response = await login(values.email, values.password)
      switch (response.profile) {
        case Profile.ADMIN:
          navigate(ADMIN_PAGES.home)
          break
        case Profile.EMPLOYEE:
          navigate(COLLABORATOR_PAGES.home)
          break
        default:
          toast.error('Perfil não encontrado')
      }
    } catch (error) {
      console.error(error)
      toast.error('Usuário ou senha inválidos')
    }
  }

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }
  return (
    <>
      <Helmet title="Login" />
      <section className="col-span-2 flex items-center justify-center p-4 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-3/4 space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Insira seu email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        placeholder="Insira sua senha"
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
            <div className="flex justify-end">
              <Button type="submit" size={'lg'} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Carregando
                  </>
                ) : (
                  <span>Entrar</span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </>
  )
}
