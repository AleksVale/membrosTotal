import { z } from 'zod'

export const resetPasswordSchema = z
  .object({
    password: z
      .string({
        required_error: 'Senha é obrigatória',
      })
      .min(1),
    confirmPassword: z
      .string({
        required_error: 'Confirmação de senha é obrigatória',
      })
      .min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas devem ser iguais',
    path: ['confirmPassword'],
  })

export type ResetPasswordType = z.infer<typeof resetPasswordSchema>
