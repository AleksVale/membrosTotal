import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateNewPasswordSchema = z.object({
  password: z
    .string({
      required_error: 'Senha é obrigatória',
    })
    .min(1),
});

// class is required for using DTO as a type
export class CreateNewPasswordDTO extends createZodDto(
  CreateNewPasswordSchema,
) {}
