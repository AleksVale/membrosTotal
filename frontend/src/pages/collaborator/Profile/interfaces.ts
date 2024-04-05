import dayjs from 'dayjs'
import { z } from 'zod'

export const editProfileSchema = z.object({
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
  birthDate: z.coerce
    .date({ required_error: 'A data de nascimento é obrigatória' })
    .transform((date) => dayjs(date, 'YYYY-DD-MM').format('YYYY-MM-DD')),
  instagram: z.string().optional(),
  pixKey: z.string().optional(),
})

export type EditProfileForm = z.infer<typeof editProfileSchema>
