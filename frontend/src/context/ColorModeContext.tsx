import { ReactNode, createContext } from 'react'
import { useLocalStorageState } from '../hooks/useLocalStorage'
import { useMediaQuery } from '@mui/material'

interface ColorModeContextProps {
  colorMode: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setColorMode: any
}

interface ColorModeProviderProps {
  children: ReactNode
}

export const ColorModeContext = createContext<
  ColorModeContextProps | undefined
>(undefined)

export const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [colorMode, setColorMode] = useLocalStorageState(
    'color-theme',
    prefersDarkMode ? 'dark' : 'light',
  )

  return (
    <ColorModeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ColorModeContext.Provider>
  )
}
