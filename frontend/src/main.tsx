import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Helmet, HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet titleTemplate="%s | NOHAU" />
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
