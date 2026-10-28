import { useLanguage } from '../i18n'
import { useCameraFocus } from '../state/camera'

export function Navigation() {
  const { t } = useLanguage()
  const { request, focus } = useCameraFocus()
  return <>
    <nav className="tour-navigation" aria-label={t.navigation}>
      {(['overview', 'reception', 'projectsWall', 'breakRoom', 'boss'] as const).map(target =>
        <button key={target} aria-pressed={request.target === target} onClick={() => focus(target)}>{t.targets[target]}</button>)}
    </nav>
  </>
}
