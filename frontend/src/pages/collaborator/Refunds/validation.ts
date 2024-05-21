import { z } from 'zod'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
]

export const createRefundchema = z.object({
  value: z.coerce.number().positive({ message: 'Valor obrigatório' }),
  description: z
    .string()
    .min(3, { message: 'Descrição obrigatória' })
    .max(191, { message: 'Descrição muito longa, use até 191 caracteres' }),
  refundTypeId: z.coerce.number({
    required_error: 'Tipo de pagamento obrigatório',
  }),
  refundDate: z.date().transform((date) => date.toISOString().split('T')[0]),
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

export type CreateRefundDTO = z.infer<typeof createRefundchema>

export const filterRefundchema = z.object({
  refundTypeId: z.string().min(1, { message: 'Status obrigatório' }),
})

export type FilterRefund = z.infer<typeof filterRefundchema>
