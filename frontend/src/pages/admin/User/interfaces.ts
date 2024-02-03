import { z } from 'zod'

export type User = {
  id: string
  email: string
  phone: string
  document: string
  birthDate: string
  instagram: string
  pixKey: string
  firstName: string
  lastName: string
}

export const createUserSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  firstName: z.string({ required_error: 'O nome é obrigatório' }),
  lastName: z.string({ required_error: 'O sobrenome é obrigatório' }),
  phone: z.string({ required_error: 'O telefone é obrigatório' }),
  document: z.string().optional(),
  birthDate: z.string({ required_error: 'A data de nascimento é obrigatória' }),
  instagram: z.string().optional(),
  pixKey: z.string().optional(),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
  profileId: z.number(),
})

export type CreateUserForm = z.infer<typeof createUserSchema>
