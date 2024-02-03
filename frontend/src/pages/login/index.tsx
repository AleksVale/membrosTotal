import { Helmet } from 'react-helmet-async'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LoginForm, LoginSchema } from './validation'
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
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

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
      await login(values.email, values.password)
      navigate('/admin/home')
    } catch (error) {
      console.error(error)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }
  return (
    <>
      <Helmet title="Login" />
      <section className="flex justify-center items-center p-4 col-span-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-3/4"
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
                    <div className="flex relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Insira sua senha"
                        {...field}
                      />
                      {showPassword ? (
                        <EyeOff
                          className="absolute right-3 top-2 text-primary cursor-pointer"
                          onClick={toggleShowPassword}
                        />
                      ) : (
                        <Eye
                          className="absolute right-3 top-2 text-primary cursor-pointer"
                          onClick={toggleShowPassword}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size={'lg'}
                asChild
                disabled={isSubmitting}
              >
                <Link to="/register">Registrar</Link>
              </Button>
              <Button type="submit" size={'lg'} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
