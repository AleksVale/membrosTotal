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
import TrainingList from './pages/collaborator/Trainings/list'
import { EditRefunds } from './pages/collaborator/Refunds/edit'
import { Permissions } from './pages/admin/Permissions'
import { CreateTraining } from './pages/admin/Training/new'
import { TrainingAdminList } from './pages/admin/Training/list'
import { EditTraining } from './pages/admin/Training/edit'
import { ModuleAdminList } from './pages/admin/Modules/list'
import { CreateModule } from './pages/admin/Modules/new'
import { EditModule } from './pages/admin/Modules/edit'
import { SubModuleAdminList } from './pages/admin/SubModules/list'
import { CreateSubModule } from './pages/admin/SubModules/new'
import { EditSubModule } from './pages/admin/SubModules/edit'
import { LessonAdminList } from './pages/admin/Lessons/list'
import { CreateLesson } from './pages/admin/Lessons/new'
import { EditLesson } from './pages/admin/Lessons/edit'
import { ListPaymentRequestsAdmin } from './pages/admin/PaymentsRequest/list'
import { ListRefundsAdmin } from './pages/admin/Refunds/list'
import ModuleList from './pages/collaborator/Modules/list'
import { TrainingPermissions } from './pages/admin/Permissions/Training'
import { ModulesPermission } from './pages/admin/Permissions/Modules'
import { SubmodulePermissions } from './pages/admin/Permissions/Submodules'
import SubmoduleList from './pages/collaborator/Submodules/list'
import LessonList from './pages/collaborator/Lessons/list'
import { Expert } from './pages/expert'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [{ path: '/', element: <Login /> }],
  },
  { path: '/expert', element: <Expert />, errorElement: <NotFound /> },
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
      { path: 'payment_requests', element: <ListPaymentRequestsAdmin /> },
      { path: 'refunds', element: <ListRefundsAdmin /> },
      { path: 'payments/new', element: <CreatePaymentAdmin /> },
      { path: 'trainings', element: <TrainingAdminList /> },
      { path: 'trainings/new', element: <CreateTraining /> },
      { path: 'trainings/:id/e', element: <EditTraining /> },
      { path: 'modules', element: <ModuleAdminList /> },
      { path: 'modules/new', element: <CreateModule /> },
      { path: 'modules/:id/e', element: <EditModule /> },
      { path: 'subModules', element: <SubModuleAdminList /> },
      { path: 'subModules/new', element: <CreateSubModule /> },
      { path: 'subModules/:id/e', element: <EditSubModule /> },
      { path: 'lessons', element: <LessonAdminList /> },
      { path: 'lessons/new', element: <CreateLesson /> },
      { path: 'lessons/:id/e', element: <EditLesson /> },
      { path: 'permissions', element: <Permissions /> },
      { path: 'permissions/training/:id', element: <TrainingPermissions /> },
      { path: 'permissions/module/:id', element: <ModulesPermission /> },
      { path: 'permissions/submodule/:id', element: <SubmodulePermissions /> },
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
      { path: 'refunds/:id/e', element: <EditRefunds /> },
      { path: 'trainings', element: <TrainingList /> },
      { path: 'trainings/:id/modules', element: <ModuleList /> },
      {
        path: 'trainings/:id/:moduleId/submodules',
        element: <SubmoduleList />,
      },
      {
        path: 'trainings/:id/:moduleId/:submoduleId/lessons',
        element: <LessonList />,
      },
    ],
  },
])
