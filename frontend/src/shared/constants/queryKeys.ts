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
  },
  
  submodules: {
    all: ['submodules'],
    list: (moduleId: number) => ['submodules', 'list', moduleId],
    detail: (id: number) => ['submodules', 'detail', id],
    permissions: (id: number) => ['submodules', 'permissions', id],
  },
  
  lessons: {
    all: ['lessons'],
    list: (submoduleId: number) => ['lessons', 'list', submoduleId],
    detail: (id: number) => ['lessons', 'detail', id],
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
};