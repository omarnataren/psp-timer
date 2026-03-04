import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BackgroundAnimation } from './components/BackgroundAnimation.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BackgroundAnimation />
    <App />
  </StrictMode>,
)
