import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import { AdminLayout } from './layouts/AdminLayout'
import CreateUser from './pages/user'

export function Router() {
  return (
    <Routes>
      <Route path="/executive" element={<AdminLayout />}>
        <Route path="" element={<Home />} />
        <Route path="user/new" element={<CreateUser />} />
      </Route>
    </Routes>
  )
}
