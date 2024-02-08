import { createBrowserRouter } from 'react-router-dom'
import NotFound from './pages/NotFound'
import { Login } from './pages/Login'
import DefaultLayout from './@layouts/DefaultLayout'
import { Home } from './pages/admin/Home'
import { ListUser } from './pages/admin/User'
import { CreateUser } from './pages/admin/User/new'
import { ListMeetings } from './pages/admin/Meeting/list'
import { AdminLayout } from './@layouts/Adminlayout'
import { CreateMeeting } from './pages/admin/Meeting/new'
import { EditUser } from './pages/admin/User/edit'
import { EditMeeting } from './pages/admin/Meeting/edit'

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
    ],
  },
])
