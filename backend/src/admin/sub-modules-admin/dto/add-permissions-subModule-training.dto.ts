import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const addPermissionSchema = z.object({
  removedUsers: z.array(z.number()).optional(),
  addedUsers: z.array(z.number()).optional(),
  addRelatives: z.boolean().optional(),
});

// class is required for using DTO as a type
export class AddPermissionAdminDTO extends createZodDto(addPermissionSchema) {}
