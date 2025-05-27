import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createTrainingSchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório' })
    .min(3, { message: 'Título deve ter no mínimo 3 caracteres' }),
  description: z
    .string({ required_error: 'A descrição é obrigatório' })
    .min(3, { message: 'A descrição deve ter no mínimo 3 caracteres' }),
  tutor: z
    .string({ required_error: 'A descrição é obrigatório' })
    .min(3, { message: 'Insira um nome válido' }),
  order: z
    .number({ required_error: 'A ordem é obrigatória' })
    .min(1, { message: 'A ordem deve ser maior que 0' }),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).optional(),
});

// class is required for using DTO as a type
export class CreateTrainingAdminDTO extends createZodDto(
  createTrainingSchema,
) {}
