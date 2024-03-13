import { createBrowserRouter } from 'react-router-dom'
import NotFound from './pages/NotFound'
import { Login } from './pages/login'
import DefaultLayout from './@layouts/DefaultLayout'
import { Home } from './pages/admin/Home'
import { ListUser } from './pages/admin/User'
import { CreateUser } from './pages/admin/User/new'
import { ListMeetings } from './pages/admin/Meeting/list'
import { AdminLayout } from './@layouts/Adminlayout'
import { CreateMeeting } from './pages/admin/Meeting/new'
import { EditUser } from './pages/admin/User/edit'
import { EditMeeting } from './pages/admin/Meeting/edit'
import { ColaboratorLayout } from './@layouts/ColaboratorLayout'
import CollaboratorHome from './pages/collaborator/Home'
import { Profile } from './pages/collaborator/Profile'
import { ColaboratorListMeeting } from './pages/collaborator/Meetings/list'
import { ListPayment } from './pages/collaborator/Payments/list'
import { CreatePayment } from './pages/collaborator/Payments/new'
import { ListPaymentAdmin } from './pages/admin/Payments/list'
import { CreatePaymentAdmin } from './pages/admin/Payments/new'
import { CreatePaymentRequest } from './pages/collaborator/PaymentRequests/new'
import { ListPaymentRequests } from './pages/collaborator/PaymentRequests/list'
import { ListRefunds } from './pages/collaborator/Refunds/list'
import { CreateRefunds } from './pages/collaborator/Refunds/new'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <NotFound />,
    children: [{ path: '/', element: <Login /> }],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <NotFound />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'user', element: <ListUser /> },
      { path: 'user/new', element: <CreateUser /> },
      { path: 'user/:id/e', element: <EditUser /> },
      { path: 'meetings', element: <ListMeetings /> },
      { path: 'meetings/new', element: <CreateMeeting /> },
      { path: 'meetings/:id/e', element: <EditMeeting /> },
      { path: 'payments', element: <ListPaymentAdmin /> },
      { path: 'payments/new', element: <CreatePaymentAdmin /> },
    ],
  },
  {
    path: '/collaborator',
    element: <ColaboratorLayout />,
    errorElement: <NotFound />,
    children: [
      { path: 'home', element: <CollaboratorHome /> },
      { path: 'profile', element: <Profile /> },
      { path: 'meetings', element: <ColaboratorListMeeting /> },
      { path: 'payments', element: <ListPayment /> },
      { path: 'payments/new', element: <CreatePayment /> },
      { path: 'payment_requests', element: <ListPaymentRequests /> },
      { path: 'payment_requests/new', element: <CreatePaymentRequest /> },
      { path: 'refunds', element: <ListRefunds /> },
      { path: 'refunds/new', element: <CreateRefunds /> },
    ],
  },
])
