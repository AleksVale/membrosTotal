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

export const createModulePermissionSchema = z.object({
  users: z.array(
    z.object({
      id: z.number(),
      fullName: z.string(),
    }),
  ),
  modules: z.array(
    z.object({
      id: z.number(),
      label: z.string(),
    }),
  ),
})

export const createSubmodulePermissionSchema = z.object({
  users: z.array(
    z.object({
      id: z.number(),
      fullName: z.string(),
    }),
  ),
  submodules: z.array(
    z.object({
      id: z.number(),
      label: z.string(),
    }),
  ),
})

export type CreatePermission = z.infer<typeof createPermissionSchema>
export type CreateModulePermission = z.infer<
  typeof createModulePermissionSchema
>
export type CreateSubmodulePermission = z.infer<
  typeof createSubmodulePermissionSchema
>
