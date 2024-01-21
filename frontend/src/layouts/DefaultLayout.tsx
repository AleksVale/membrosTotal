import { Box } from '@mui/material'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export function DefaultLayout() {
  const pathName = useLocation().pathname
  const navigate = useNavigate()

  useEffect(() => {
    if (pathName === '/') {
      navigate('/login')
    }
  }, [navigate, pathName])
  return (
    <Box bgcolor={'background.default'} width={'100vw'} height={'100vh'}>
      <Box
        display={'flex'}
        justifyContent="center"
        alignItems={'center'}
        p={4}
        component="main"
        height={'100%'}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
