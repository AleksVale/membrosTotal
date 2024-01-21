import { Box } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'
import Header from '../components/header'

export function AdminLayout() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (profile !== 'admin') {
      logout()
      navigate('/login')
    }
  }, [profile, logout, navigate])

  return (
    <Box bgcolor={'background.default'} width={'100vw'} height={'100vh'}>
      <Header />
      <Box display={'flex'} justifyContent="center" p={4}>
        <Outlet />
      </Box>
    </Box>
  )
}
