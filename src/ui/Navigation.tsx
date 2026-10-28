import { useLanguage } from '../i18n'
import { useCameraFocus } from '../state/camera'
import { PixelIcon } from './PixelIcon'

const zones = ['reception', 'projectsWall', 'breakRoom', 'boss', 'overview'] as const

export function Navigation() {
  const { t } = useLanguage()
  const { request, focus } = useCameraFocus()
  const zone = zones.find(target => target === request.target)
  const focusLabel = zone && zone !== 'overview' ? t.zoneLabels[zone]
    : request.target === 'pikachu' ? t.pikachu : request.target === 'cat' ? t.cat
    : request.target === 'tyrunt' || request.target === 'magikarp' ? t.pets[request.target] : t.targets[request.target]
  return <>
    <div className="navigation-context">
      <span className="zone-label" role="status">{focusLabel}</span>
    </div>
    <nav className="tour-navigation" aria-label={t.navigation}>
      {zones.map(target =>
        <button key={target} aria-pressed={request.target === target} onClick={() => focus(target)}>
          <span className="tab-icon"><PixelIcon name={target} /></span>
          <span>{target === 'overview' ? t.overviewTab : t.zones[target]}</span>
        </button>)}
    </nav>
  </>
}
