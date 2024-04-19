import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

// create a Zod schema for Module creation
const createModuleSchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório' })
    .min(3, { message: 'Título deve ter no mínimo 3 caracteres' }),
  description: z
    .string({ required_error: 'A descrição é obrigatório' })
    .min(3, { message: 'A descrição deve ter no mínimo 3 caracteres' }),
  trainingId: z.number({ required_error: 'O id do treinamento é obrigatório' }),
});

// create a DTO class using createZodDto
export class CreateModuleAdminDTO extends createZodDto(createModuleSchema) {
  // you can add additional properties or methods if needed
}
