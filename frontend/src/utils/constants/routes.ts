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
  newPaymentRequest: '/admin/payment_requests/new',
  listRefund: '/admin/refunds?page=1&per_page=10',
  newRefund: '/admin/refunds/new',
  listTrainings: '/admin/trainings',
  createTrainings: '/admin/trainings/new',
  permissions: '/admin/permissions',
}

export const COLLABORATOR_PAGES = {
  prefix: '/collaborator',
  home: '/collaborator/profile',
  listMeetings: '/collaborator/meetings?page=1&per_page=10',
  profile: '/collaborator/profile',
  listPayments: '/collaborator/payments?page=1&per_page=10',
  newPayment: '/collaborator/payments/new',
  listPaymentRequest: '/collaborator/payment_requests?page=1&per_page=10',
  newPaymentRequest: '/collaborator/payment_requests/new',
  listRefund: '/collaborator/refunds?page=1&per_page=10',
  newRefund: '/collaborator/refunds/new',
  listTrainings: '/collaborator/trainings',
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

export const DEFAULT_META_PAGINATION = {
  currentPage: 1,
  lastPage: 1,
  next: 1,
  perPage: 10,
  prev: 1,
  total: 0,
}
