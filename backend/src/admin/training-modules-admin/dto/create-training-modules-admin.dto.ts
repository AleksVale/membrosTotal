import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

// create a Zod schema for Module creation
const createModuleSchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório' })
    .min(3, { message: 'Título deve ter no mínimo 3 caracteres' }),
  description: z
    .string()
    .min(3, { message: 'A descrição deve ter no mínimo 3 caracteres' })
    .optional(),
  trainingId: z.number({ required_error: 'O id do treinamento é obrigatório' }),
  order: z
    .number()
    .min(0, { message: 'A ordem deve ser maior ou igual a 0' })
    .optional()
    .default(0),
});

// create a DTO class using createZodDto
export class CreateModuleAdminDTO extends createZodDto(createModuleSchema) {
  // you can add additional properties or methods if needed
}
