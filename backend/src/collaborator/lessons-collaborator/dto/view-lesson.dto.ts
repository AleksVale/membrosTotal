import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const viewLessonSchema = z.object({
  id: z.number({ required_error: 'O valor é obrigatório' }),
});

// class is required for using DTO as a type
export class ViewLessonDto extends createZodDto(viewLessonSchema) {}
