import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { DateUtils } from '../../utils/date';

const CreateUserSchema = z.object({
  password: z
    .string({
      required_error: 'Senha é obrigatória',
    })
    .min(1),
  phone: z.string().optional(),
  email: z
    .string({
      required_error: 'E-mail é obrigatório',
    })
    .email({ message: 'E-mail inválido.' }),
  document: z.string().optional(),
  birthDate: z
    .dateString({ required_error: 'Data de nascimento é obrigatória' })
    .format('date')
    .refine((date) => DateUtils.isEighteenOrOlder(date), {
      message: 'O usuário deve ser maior de idade.',
    })
    .describe('Deve ser maior de idade'),
  instagram: z.string().optional(),
  pixKey: z.string().optional(),
  photoKey: z.string().optional(),
  profileId: z.number({
    required_error: 'O perfil é obrigatório',
    invalid_type_error: 'O perfil deve ser um número',
  }),
});

// class is required for using DTO as a type
export class CreateUserDTO extends createZodDto(CreateUserSchema) {}
