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
  firstName: z
    .string({ required_error: 'O nome é obrigatório' })
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  lastName: z
    .string({ required_error: 'O sobrenome é obrigatório' })
    .min(3, { message: 'O sobrenome deve ter pelo menos 3 caracteres' }),
  phone: z
    .string({ required_error: 'O telefone é obrigatório' })
    .min(11, { message: 'O telefone deve ter pelo menos 3 caracteres' }),

  document: z.string().optional(),
  birthDate: z.date({ required_error: 'A data de nascimento é obrigatória' }),
  instagram: z.string().optional(),
  pixKey: z.string().optional(),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
  profileId: z.coerce.number({
    required_error: 'O perfil é obrigatório',
    invalid_type_error: 'O perfil é inválido',
  }),
})

export type CreateUserForm = z.infer<typeof createUserSchema>
