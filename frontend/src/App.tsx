import { RouterProvider } from 'react-router-dom'
import { routes } from './Routes'
import './global.css'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={routes} />
    </ThemeProvider>
  )
}

export default App
