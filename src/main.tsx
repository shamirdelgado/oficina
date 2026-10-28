import { createRoot } from 'react-dom/client'
import { App } from './App'
import { LanguageProvider } from './i18n'
import { CameraProvider } from './state/camera'
import { ThemeProvider } from './state/theme'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider><LanguageProvider><CameraProvider><App /></CameraProvider></LanguageProvider></ThemeProvider>,
)
