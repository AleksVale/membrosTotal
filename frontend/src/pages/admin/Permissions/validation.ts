import { z } from 'zod'

export const createPermissionSchema = z.object({
  users: z.array(z.number()),
  addRelatives: z.boolean(),
})

export type CreatePermission = z.infer<typeof createPermissionSchema>
export type CreateModulePermission = z.infer<typeof createPermissionSchema>
export type CreateSubmodulePermission = z.infer<typeof createPermissionSchema>
