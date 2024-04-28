import { z } from 'zod'

export const createLesson = z.object({
  title: z
    .string({ required_error: 'Título obrigatório' })
    .min(2, { message: 'Título obrigatório' }),
  description: z
    .string({ required_error: 'Descrição obrigatória' })
    .min(2, { message: 'Descrição obrigatória' }),
  order: z.coerce
    .number({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Ordem deve ser maior que 0' }),
  submoduleId: z.coerce.number({
    required_error: 'Selecione um módulo',
    invalid_type_error: 'Selecione um módulo',
  }),
  content: z.string().url({ message: 'Insira uma URL válida' }),
})

export type CreateLessonDTO = z.infer<typeof createLesson>
