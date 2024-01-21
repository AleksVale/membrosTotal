import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { AuthProvider } from './context/AuthContext'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { darkTheme } from './themes/dark'
import { useColorModeValue } from './hooks/useColorMode'
import theme from './themes/ligth'

function App() {
  const { colorMode } = useColorModeValue()
  return (
    <ThemeProvider theme={colorMode === 'dark' ? darkTheme : theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
