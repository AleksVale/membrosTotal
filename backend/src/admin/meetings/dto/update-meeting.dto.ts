import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const UpdateMeetingSchema = z.object({
  title: z
    .string({ required_error: 'Título é obrigatório' })
    .min(3, { message: 'Título deve ter no mínimo 3 caracteres' })
    .optional(),
  link: z
    .string({ required_error: 'O link da reunião deve ser informado' })
    .url({ message: 'Link deve ser uma URL válida' })
    .optional(),
  meetingDate: z
    .dateString({ required_error: 'A data da reunião é obrigatória' })
    .format('date-time')
    .optional(),
  users: z.array(z.number()).optional(),
  status: z.enum(['DONE', 'CANCELED']).optional(),
});

export class UpdateMeetingDTO extends createZodDto(UpdateMeetingSchema) {}
