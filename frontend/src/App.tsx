import { RouterProvider } from 'react-router-dom'
import { routes } from './Routes'
import './global.css'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <RouterProvider router={routes} />
        <ToastContainer theme="dark" />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
