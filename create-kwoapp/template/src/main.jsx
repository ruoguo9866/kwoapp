import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Storage } from '@ruoguo/k-storage'
import './index.css'
import App from './App.jsx'

// 应用启动时恢复已保存的主题色
const THEME_COLORS = { blue: '#1677ff', green: '#00b578', orange: '#ff7a45', purple: '#722ed1' }
const savedTheme = Storage.get('theme-color') || 'blue'
document.documentElement.style.setProperty('--adm-color-primary', THEME_COLORS[savedTheme] || THEME_COLORS.blue)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
