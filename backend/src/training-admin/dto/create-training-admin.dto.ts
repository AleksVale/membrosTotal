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
});

// class is required for using DTO as a type
export class CreateTrainingAdminDTO extends createZodDto(
  createTrainingSchema,
) {}
