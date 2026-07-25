import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SignalRoute from './SignalRoute.tsx'

const isSignalPage = window.location.pathname.replace(/\/+$/, '').endsWith('/signal')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isSignalPage ? (
      <SignalRoute />
    ) : (
      <App />
    )}
  </StrictMode>,
)
