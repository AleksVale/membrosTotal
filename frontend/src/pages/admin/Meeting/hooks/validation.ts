import { z } from 'zod'

export const createMeetingSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Título deve ter no mínimo 3 caracteres' }),
  description: z
    .string()
    .min(3, { message: 'A descrição deve ter no mínimo 3 caracteres' }),
  link: z.string().url({ message: 'Link deve ser uma URL válida' }),
  meetingDate: z.date(),
  users: z.array(
    z.object({
      id: z.number(),
      fullName: z.string(),
    }),
  ),
})

export type CreateMeetingDTO = z.infer<typeof createMeetingSchema>

export const filterMeetingSchema = z.object({
  title: z.string().optional(),
  date: z.date().optional(),
  status: z.enum(['PENDING', 'DONE', 'CANCELED', 'ALL']).optional(),
})

export type FilterMeeting = z.infer<typeof filterMeetingSchema>
