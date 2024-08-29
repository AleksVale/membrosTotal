import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
const requiredError = 'O campo é obrigatório';

export const QuestionarioSchema = z.object({
  nome: z.string({ required_error: requiredError }).min(2, requiredError),
  email: z
    .string({ required_error: requiredError })
    .email({ message: 'E-mail inválido' }),
  whatsapp: z.string({ required_error: requiredError }).min(2, requiredError),
  instagram: z.string({ required_error: requiredError }).min(2, requiredError),
  experienciaEdicao: z.enum(['SIM', 'NÃO'], { required_error: requiredError }),
  experienciaMotionGraphics: z.enum(['SIM', 'NÃO'], {
    required_error: requiredError,
  }),
  computador: z.string({ required_error: requiredError }).min(2, requiredError),
  programaEdicao: z
    .string({ required_error: requiredError })
    .min(2, requiredError),
  trabalhosAnteriores: z
    .string({ required_error: requiredError })
    .min(2, requiredError),
  habilidades: z
    .string({ required_error: requiredError })
    .min(2, requiredError),
  portfolio: z
    .string({ required_error: requiredError })
    .url({ message: 'URL inválida' }),
  disponibilidadeImediata: z.enum(['SIM', 'NÃO'], {
    required_error: requiredError,
  }),
  pretensaoSalarial: z.number({ required_error: requiredError }),
  disponibilidadeTempo: z
    .string({ required_error: requiredError })
    .min(2, requiredError),
});

export class CreateQuestionarioDTO extends createZodDto(QuestionarioSchema) {}
