import { z } from 'zod'

export const createPermissionSchema = z.object({
  users: z.array(
    z.object({
      id: z.number(),
      fullName: z.string(),
    }),
  ),
  trainings: z.array(
    z.object({
      id: z.number(),
      label: z.string(),
    }),
  ),
})

export type CreatePermission = z.infer<typeof createPermissionSchema>
