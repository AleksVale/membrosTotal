import dayjs from 'dayjs'
import { z } from 'zod'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

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
  file: z
    .any()
    .refine((files) => {
      if (!files[0] || typeof files[0] === 'string') {
        return true
      }
      return files?.[0]?.size <= MAX_FILE_SIZE
    }, `Tamanho máximo: 5MB.`)
    .refine((files) => {
      if (!files[0] || typeof files[0] === 'string') {
        return true
      }
      return ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)
    }, 'Apenas .jpg, .jpeg, .png e .webp formatos são suportados.'),
})

export type EditProfileForm = z.infer<typeof editProfileSchema>
