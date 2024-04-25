import { z } from 'zod'

export const createNotificationchema = z.object({
  title: z.string().min(3, { message: 'Título obrigatório' }),
  description: z
    .string()
    .min(3, { message: 'Descrição obrigatória' })
    .max(191, { message: 'Descrição muito longa, use até 191 caracteres' }),
  users: z.array(z.object({ id: z.number(), fullName: z.string() })),
})

export type CreateNotificationDTO = z.infer<typeof createNotificationchema>
