import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createNotificationSchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório' })
    .min(3, { message: 'O título deve ter no mínimo 3 caracteres' }),
  message: z.string({ required_error: 'A mensagem é obrigatória' }),
  users: z.array(z.number()),
});

// class is required for using DTO as a type
export class CreateNotificationAdminDTO extends createZodDto(
  createNotificationSchema,
) {}
