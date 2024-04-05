import { z } from 'zod'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
]

export const createTraining = z.object({
  title: z.string({ required_error: 'Título obrigatório' }),
  description: z.string({ required_error: 'Descrição obrigatória' }),
  tutor: z.string({ required_error: 'Campo obrigatório' }),
  file: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Apenas .pdf, .jpg, .jpeg, .png and .webp formatos são suportados.',
    ),
})

export type CreateTrainingDTO = z.infer<typeof createTraining>
