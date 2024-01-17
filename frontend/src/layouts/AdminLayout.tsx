import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export function AdminLayout() {
  return (
    <Box bgcolor={'background.default'} width={'100vw'} height={'100vh'}>
      <div>header</div>
      <Box display={'flex'} justifyContent="center" p={4}>
        <Outlet />
      </Box>
    </Box>
  )
}
