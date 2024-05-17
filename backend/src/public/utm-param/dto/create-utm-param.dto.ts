import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
const requiredError = 'O campo é obrigatório';

export const UtmParamSchema = z.object({
  utmSource: z.string({ required_error: requiredError }).optional().nullable(),
  utmMedium: z.string({ required_error: requiredError }).optional().nullable(),
  utmCampaign: z
    .string({ required_error: requiredError })
    .optional()
    .nullable(),
  utmTerm: z.string({ required_error: requiredError }).optional().nullable(),
  utmContent: z.string({ required_error: requiredError }).optional().nullable(),
});

export class CreateUtmParamDto extends createZodDto(UtmParamSchema) {}
