import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n'

let dismissed = false
try { dismissed = sessionStorage.getItem('office-explored') === 'true' } catch { /* Almacenamiento opcional. */ }

export function TourInstructions() {
  const { t } = useLanguage()
  const [hidden, setHidden] = useState(dismissed)

  useEffect(() => {
    if (hidden) return
    const dismiss = (event: Event) => {
      if (!(event.target instanceof Element) || !event.target.closest('.office-view, .tour-navigation')) return
      dismissed = true
      setHidden(true)
      try { sessionStorage.setItem('office-explored', 'true') } catch { /* Almacenamiento opcional. */ }
    }
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') dismiss(event)
    }
    document.addEventListener('pointerdown', dismiss, { passive: true, capture: true })
    document.addEventListener('wheel', dismiss, { passive: true, capture: true })
    document.addEventListener('keydown', key, true)
    return () => {
      document.removeEventListener('pointerdown', dismiss, true)
      document.removeEventListener('wheel', dismiss, true)
      document.removeEventListener('keydown', key, true)
    }
  }, [hidden])

  return <p className={`tour-instructions${hidden ? ' is-hidden' : ''}`} aria-hidden={hidden}>{t.instructions}</p>
}
