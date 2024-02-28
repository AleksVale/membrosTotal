import { z } from 'zod'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
]

export const createPaymentchema = z.object({
  value: z.coerce.number().positive({ message: 'Valor obrigatório' }),
  description: z
    .string()
    .min(3, { message: 'Descrição obrigatória' })
    .max(191, { message: 'Descrição muito longa, use até 191 caracteres' }),
  paymentTypeId: z.coerce.number({
    required_error: 'Tipo de pagamento obrigatório',
  }),
  file: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only .pdf, .jpg, .jpeg, .png and .webp formats are supported.',
    ),
})

export type CreatePaymentDTO = z.infer<typeof createPaymentchema>

export const filterPaymentchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'CANCELLED', 'APPROVED', 'ALL']),
})

export type FilterPayment = z.infer<typeof filterPaymentchema>
