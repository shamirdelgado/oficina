import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { useLanguage } from '../i18n'
import { useReducedMotion } from '../state/motion'

export function LoadingScreen({ ready, onComplete }: { ready: boolean; onComplete: () => void }) {
  const { active, progress } = useProgress()
  const { t } = useLanguage()
  const reducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const complete = ready && !active
  useEffect(() => {
    if (!complete) return
    const timer = window.setTimeout(() => { setVisible(false); onComplete() }, reducedMotion ? 0 : 500)
    return () => window.clearTimeout(timer)
  }, [complete, reducedMotion, onComplete])
  if (!visible) return null
  return <div className={`loading-screen ${complete ? 'is-ready' : ''}`} role="status" aria-live="polite">
    <div className="loading-mark" aria-hidden="true"><span /><span /><span /></div>
    <p>{t.opening}</p>
    <progress aria-label={t.loadingProgress} value={complete ? 100 : progress} max={100} />
  </div>
}
