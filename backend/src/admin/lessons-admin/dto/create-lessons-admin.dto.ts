// lesson.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

// create a Zod schema for Lesson creation
const createLessonSchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório' })
    .min(3, { message: 'Título deve ter no mínimo 3 caracteres' }),
  description: z.string().optional(),
  content: z
    .string({ required_error: 'Conteúdo obrigatório' })
    .url({ message: 'O conteúdo deve ser uma URL válida' }),
  submoduleId: z.number({ required_error: 'O id do submódulo é obrigatório' }),
  order: z
    .number({ required_error: 'A ordem é obrigatória' })
    .min(1, { message: 'A ordem deve ser maior que 0' }),
});

// create a DTO class using createZodDto
export class CreateLessonAdminDTO extends createZodDto(createLessonSchema) {}
