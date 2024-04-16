import { Outlet } from 'react-router'
import logo from '@/assets/logo-laranja.png'

export default function DefaultLayout() {
  return (
    <main>
      <div className="bg-gradiante-bg h-screen w-full bg-cover">
        <div className="grid h-screen w-full grid-cols-5 bg-black bg-opacity-20">
          <section className="col-span-3 flex items-center justify-center">
            <img src={logo} alt="" />
          </section>
          <Outlet />
        </div>
      </div>
    </main>
  )
}
