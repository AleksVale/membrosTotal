import { z } from 'zod'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
]

export const createModule = z.object({
  title: z
    .string({ required_error: 'Título obrigatório' })
    .min(2, { message: 'Título obrigatório' }),
  description: z
    .string({ required_error: 'Descrição obrigatória' })
    .min(2, { message: 'Descrição obrigatória' }),
  trainingId: z.coerce.number({
    required_error: 'Selecione um treinamento',
    invalid_type_error: 'Selecione um treinamento',
  }),
  order: z.coerce
    .number({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Ordem deve ser maior que 0' }),
  file: z
    .any()
    .refine((files) => {
      if (files.length <= 0) return true
      return files?.[0]?.size <= MAX_FILE_SIZE
    }, `Max image size is 5MB.`)
    .refine((files) => {
      if (files.length <= 0) {
        return true
      }
      return ACCEPTED_IMAGE_TYPES.includes(files[0].type)
    }, 'Apenas .pdf, .jpg, .jpeg, .png and .webp formatos são suportados.'),
})

export type CreateModuleDTO = z.infer<typeof createModule>
