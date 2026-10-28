import { createRoot } from 'react-dom/client'
import { App } from './App'
import { LanguageProvider } from './i18n'
import { CameraProvider } from './state/camera'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <LanguageProvider><CameraProvider><App /></CameraProvider></LanguageProvider>,
)
