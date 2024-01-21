import React from 'react'
import { AppBar, Toolbar, Typography, Switch, IconButton } from '@mui/material'
import NightsStayIcon from '@mui/icons-material/NightsStay'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import { useColorModeValue } from '../hooks/useColorMode'

const Header = () => {
  const { colorMode, setColorMode } = useColorModeValue()

  const handleColorModeToggle = () => {
    setColorMode((prevMode: string) =>
      prevMode === 'light' ? 'dark' : 'light',
    )
  }

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Your logo component */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Your Logo
        </Typography>

        {/* Dark/Light mode toggle */}
        <Typography variant="body2" sx={{ marginRight: 2 }}>
          {colorMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </Typography>
        <Switch
          checked={colorMode === 'dark'}
          onChange={handleColorModeToggle}
          color="default"
          inputProps={{ 'aria-label': 'toggle dark/light mode' }}
        />
        {colorMode === 'dark' ? <NightsStayIcon /> : <WbSunnyIcon />}

        {/* Add more header components as needed */}
        <IconButton color="inherit" /* onClick={handleSomeAction} */>
          {/* Your icon component */}
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header
