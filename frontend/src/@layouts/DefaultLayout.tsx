import { Outlet } from 'react-router'
import logo from '@/assets/logo-laranja.png'

export default function DefaultLayout() {
  return (
    <main>
      <div className="bg-gradiante-bg grid h-screen grid-cols-5 bg-cover">
        <section className=" border-r-foreground col-span-3 flex items-center justify-center border-r">
          <img src={logo} alt="" />
        </section>
        <Outlet />
      </div>
    </main>
  )
}
