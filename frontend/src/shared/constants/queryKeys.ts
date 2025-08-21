/**
 * Centralized React Query keys for the application
 * 
 * This file contains all the query keys used across the application
 * to ensure consistency and prevent typos.
 */

export const QueryKeys = {
  users: {
    all: ['users'],
    list: (params?: string) => ['users', 'list', params],
    detail: (id: number | string) => ['users', 'detail', id],
    profile: ['users', 'profile'],
  },
  
  payments: {
    all: ['payments'],
    list: (params?: string) => ['payments', 'list', params],
    detail: (id: number) => ['payments', 'detail', id],
  },
  
  paymentTypes: {
    all: ['paymentTypes'],
  },
  
  paymentRequests: {
    all: ['paymentRequests'],
    list: (params?: string) => ['paymentRequests', 'list', params],
    detail: (id: number) => ['paymentRequests', 'detail', id],
  },
  
  refunds: {
    all: ['refunds'],
    list: (params?: string) => ['refunds', 'list', params],
    detail: (id: number) => ['refunds', 'detail', id],
  },

  trainings: {
    all: ['trainings'],
    list: (params?: string) => ['trainings', 'list', params],
    detail: (id: number) => ['trainings', 'detail', id],
    permissions: (id: number) => ['trainings', 'permissions', id],
    stats: (id: number) => ['trainings', 'stats', id],
  },
  
  modules: {
    all: ['modules'],
    list: (trainingId: number | string, params?: string) => ['modules', 'list', trainingId, params],
    detail: (id: number) => ['modules', 'detail', id],
    permissions: (id: number) => ['modules', 'permissions', id],
    stats: (id: number) => ['modules', 'stats', id],
    autocomplete: ['modules', 'autocomplete'],
  },
  
  submodules: {
    all: ['submodules'],
    list: (page?: number, perPage?: number, search?: string, moduleId?: number, filters?: Record<string, string | undefined>) => 
      ['submodules', 'list', page, perPage, search, moduleId, filters],
    byModule: (moduleId: number) => ['submodules', 'list', moduleId],
    detail: (id: number) => ['submodules', 'detail', id],
    permissions: (id: number) => ['submodules', 'permissions', id],
  },
  
  lessons: {
    all: ['lessons'],
    list: (params?: { submoduleId?: number; page?: number; perPage?: number; search?: string; filters?: Record<string, string | number | undefined> }) => 
      ['lessons', 'list', params],
    detail: (id: number) => ['lessons', 'detail', id],
    autocomplete: ['lessons', 'autocomplete'],
  },

  meetings: {
    all: ['meetings'],
    list: (params?: string) => ['meetings', 'list', params],
    detail: (id: number) => ['meetings', 'detail', id],
  },

  autocomplete: {
    fields: (fields: string[]) => ['autocomplete', ...fields],
    users: ['autocomplete', 'users'],
    paymentTypes: ['autocomplete', 'paymentTypes'],
    experts: ['autocomplete', 'experts'],
  },

  notifications: {
    all: ['notifications'],
    list: (params?: string) => ['notifications', 'list', params],
    unread: ['notifications', 'unread'],
    detail: (id: number) => ['notifications', 'detail', id],
  },

  collaborator: {
    dashboard: ['collaborator', 'dashboard'],
    trainings: {
      all: ['collaborator', 'trainings'],
      list: (params?: string) => ['collaborator', 'trainings', 'list', params],
      detail: (id: number) => ['collaborator', 'trainings', 'detail', id],
    },
    modules: {
      all: ['collaborator', 'modules'],
      list: (params?: string) => ['collaborator', 'modules', 'list', params],
      detail: (id: number) => ['collaborator', 'modules', 'detail', id],
    },
    submodules: {
      all: ['collaborator', 'submodules'],
      list: (params?: string) => ['collaborator', 'submodules', 'list', params],
      detail: (id: number) => ['collaborator', 'submodules', 'detail', id],
    },
    lessons: {
      all: ['collaborator', 'lessons'],
      list: (params?: string) => ['collaborator', 'lessons', 'list', params],
      detail: (id: number) => ['collaborator', 'lessons', 'detail', id],
    },
    meetings: {
      all: ['collaborator', 'meetings'],
      list: (params?: string) => ['collaborator', 'meetings', 'list', params],
      detail: (id: number) => ['collaborator', 'meetings', 'detail', id],
    },
    payments: {
      all: ['collaborator', 'payments'],
      list: (params?: string) => ['collaborator', 'payments', 'list', params],
      detail: (id: number) => ['collaborator', 'payments', 'detail', id],
      overview: ['collaborator', 'payments', 'overview'],
      monthly: (months: number) => ['collaborator', 'payments', 'monthly', months],
      categories: ['collaborator', 'payments', 'categories'],
    },
    paymentRequests: {
      all: ['collaborator', 'paymentRequests'],
      list: (params?: string) => ['collaborator', 'paymentRequests', 'list', params],
      detail: (id: number) => ['collaborator', 'paymentRequests', 'detail', id],
    },
    refunds: {
      all: ['collaborator', 'refunds'],
      list: (params?: string) => ['collaborator', 'refunds', 'list', params],
      detail: (id: number) => ['collaborator', 'refunds', 'detail', id],
    },
    notifications: {
      all: ['collaborator', 'notifications'],
      list: (params?: string) => ['collaborator', 'notifications', 'list', params],
      detail: (id: number) => ['collaborator', 'notifications', 'detail', id],
    },
  },
};