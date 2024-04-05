import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateMeetingSchema = z.object({
  title: z
    .string({ required_error: 'Título é obrigatório' })
    .min(3, { message: 'Título deve ter no mínimo 3 caracteres' }),
  description: z
    .string({ required_error: 'A descrição é obrigatório' })
    .min(3, { message: 'A descrição deve ter no mínimo 3 caracteres' }),
  link: z
    .string({ required_error: 'O link da reunião deve ser informado' })
    .url({ message: 'Link deve ser uma URL válida' }),
  meetingDate: z
    .dateString({ required_error: 'A data da reunião é obrigatória' })
    .format('date-time'),
  users: z.array(z.number()),
});

// class is required for using DTO as a type
export class CreateMeetingDTO extends createZodDto(CreateMeetingSchema) {}
