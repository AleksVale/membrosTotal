import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const addPermissionSubModuleSchema = z.object({
  users: z.array(
    z.number({
      invalid_type_error: 'User ID deve ser um número',
      required_error: 'User ID é obrigatório',
    }),
  ),
});

// class is required for using DTO as a type
export class AddPermissionSubModuleAdminDTO extends createZodDto(
  addPermissionSubModuleSchema,
) {}
