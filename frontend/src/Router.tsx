import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { AdminLayout } from './layouts/AdminLayout'
import CreateUser from './pages/user'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Login } from './pages/login'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="login" element={<Login />} />
      </Route>
      <Route path="/executive" element={<AdminLayout />}>
        <Route path="" element={<Home />} />
        <Route path="user/new" element={<CreateUser />} />
      </Route>
    </Routes>
  )
}
