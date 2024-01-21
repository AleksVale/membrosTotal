import { useContext } from 'react'
import { ColorModeContext } from '../context/ColorModeContext'

export const useColorModeValue = () => {
  const context = useContext(ColorModeContext)
  if (!context) {
    throw new Error('useColorModeValue must be used with an ColorModeProvider')
  }
  return context
}
