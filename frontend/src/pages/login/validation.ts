import { z } from 'zod'

export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'O e-mail é obrigatório' })
    .email({ message: 'Email inválido' }),
  password: z.string().min(6, 'A senha deve ter 6 caracteres'),
})

export type LoginForm = z.infer<typeof LoginSchema>
