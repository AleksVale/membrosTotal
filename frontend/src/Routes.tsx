import { createBrowserRouter } from 'react-router-dom'
import NotFound from './pages/NotFound'
import { Login } from './pages/Login'
import DefaultLayout from './@layouts/DefaultLayout'
import { AdminLayout } from './@layouts/AdminLayout'
import { Home } from './pages/admin/Home'
import { ListUser } from './pages/admin/User'
import { CreateUser } from './pages/admin/User/new'

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
    ],
  },
])
