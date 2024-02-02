import { Outlet } from 'react-router'
import logo from '@/assets/logo.jpg'

export default function DefaultLayout() {
  return (
    <main>
      <div className="grid grid-cols-5 h-screen">
        <section className="flex justify-center items-center bg-background border-r border-r-foreground col-span-3">
          <img src={logo} alt="" />
        </section>
        <Outlet />
      </div>
    </main>
  )
}
