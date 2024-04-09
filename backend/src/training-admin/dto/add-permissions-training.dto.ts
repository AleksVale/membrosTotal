import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const addPermissionTrainingSchema = z.object({
  users: z.array(
    z.number({
      invalid_type_error: 'User ID deve ser um número',
      required_error: 'User ID é obrigatório',
    }),
  ),
  trainings: z.array(
    z.number({
      invalid_type_error: 'Training ID deve ser um número',
      required_error: 'Training ID é obrigatório',
    }),
  ),
});

// class is required for using DTO as a type
export class AddPermissionTrainingAdminDTO extends createZodDto(
  addPermissionTrainingSchema,
) {}
