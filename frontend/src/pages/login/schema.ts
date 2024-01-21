import { z, ZodError } from 'nestjs-zod/z'

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type LoginFormValues = z.infer<typeof LoginFormSchema>

export type LoginFormErrors = ZodError<LoginFormValues>
