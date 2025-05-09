export const ADMIN_PAGES = {
  prefix: '/admin',
  home: '/admin/home',
  listUsers: '/admin/user?page=1&per_page=10',
  createUser: '/admin/user/new',
  listMeetings: '/admin/meetings?page=1&per_page=10',
  createMeeting: '/admin/meetings/new',
  settings: '/admin/settings',
  listPayments: '/admin/payments?page=1&per_page=10',
  newPayment: '/admin/payments/new',
  listPaymentRequest: '/admin/payment_requests?page=1&per_page=10',
  listRefund: '/admin/refunds?page=1&per_page=10',
  listTrainings: '/admin/trainings?page=1&per_page=10',
  createTrainings: '/admin/trainings/new',
  editTraining: (id: number) => `/admin/trainings/${id}/e`,
  permissions: '/admin/permissions',
  trainingPermissions: (id: number) => `/admin/permissions/training/${id}`,
  modulesPermissions: (id: number) => `/admin/permissions/module/${id}`,
  submodulesPermissions: (id: number) => `/admin/permissions/submodule/${id}`,
  listModules: '/admin/modules?page=1&per_page=10',
  createModules: '/admin/modules/new',
  editModule: (id: number) => `/admin/modules/${id}/e`,
  listSubModules: '/admin/subModules?page=1&per_page=10',
  createSubModules: '/admin/subModules/new',
  editSubModule: (id: number) => `/admin/subModules/${id}/e`,
  listLessons: '/admin/lessons?page=1&per_page=10',
  createLessons: '/admin/lessons/new',
  editLesson: (id: number) => `/admin/lessons/${id}/e`,
  listExperts: '/admin/experts?page=1&per_page=10',
  listNotifications: '/admin/notifications?page=1&per_page=10',
  createNotification: '/admin/notifications/new',
  resetPassword: (id: string) => `/admin/user/${id}/reset-password`,
  questionario: '/admin/questionario',
}

export const COLLABORATOR_PAGES = {
  prefix: '/collaborator',
  home: '/collaborator/home',
  listMeetings: '/collaborator/meetings?page=1&per_page=10',
  profile: '/collaborator/profile',
  listPayments: '/collaborator/payments?page=1&per_page=10',
  newPayment: '/collaborator/payments/new',
  listPaymentRequest: '/collaborator/payment_requests?page=1&per_page=10',
  newPaymentRequest: '/collaborator/payment_requests/new',
  listRefund: '/collaborator/refunds?page=1&per_page=10',
  newRefund: '/collaborator/refunds/new',
  listTrainings: '/collaborator/trainings',
  subModulesList: (training: string | undefined, module: number) =>
    `/collaborator/trainings/${training}/${module}/submodules`,
  lessonsList: (
    training: string | undefined,
    module: string | undefined,
    submodule: number,
    submoduleName: string,
  ) =>
    `/collaborator/trainings/${training}/${module}/${submodule}/lessons?submoduleName=${submoduleName}`,
}

export const AUTH_PAGES = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
}

export interface SuccessResponse {
  success: boolean
}

export interface SignedURLResponse {
  signedUrl: string
}

export const DEFAULT_META_PAGINATION = {
  currentPage: 1,
  lastPage: 1,
  next: 1,
  perPage: 10,
  prev: 1,
  total: 0,
}
