import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

// create a Zod schema for Module creation
const createSubModuleSchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório' })
    .min(3, { message: 'Título deve ter no mínimo 3 caracteres' }),
  description: z
    .string({ required_error: 'A descrição é obrigatório' })
    .min(3, { message: 'A descrição deve ter no mínimo 3 caracteres' }),
  moduleId: z.number({ required_error: 'O id do treinamento é obrigatório' }),
  order: z
    .number({ required_error: 'A ordem é obrigatória' })
    .min(1, { message: 'A ordem deve ser maior que 0' }),
});

// create a DTO class using createZodDto
export class CreateSubModuleAdminDTO extends createZodDto(
  createSubModuleSchema,
) {
  // you can add additional properties or methods if needed
}
