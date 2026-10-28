import { editVisitor } from '../state/visitor'
import { useLanguage } from '../i18n'
import { useTheme } from '../state/theme'
import { PixelIcon } from './PixelIcon'

export function TopBar() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const nextLanguage = language === 'es' ? 'en' : 'es'
  return <header className="top-bar">
    <a className="back-link" href={`https://shamirdelgado.github.io/?lang=${language}`}>
      <span className="back-arrow" aria-hidden="true">↖</span>
      <span className="back-full">{t.back}</span>
      <span className="back-short">{t.backShort}</span>
    </a>
    <span className="office-path">{t.officePath}</span>
    <button className="change-name" onClick={editVisitor} aria-label={t.changeName} title={t.changeName}>
      <PixelIcon name="pencil" /><span>{t.changeName}</span>
    </button>
    <button className="language-switch" lang={nextLanguage}
      aria-label={nextLanguage === 'es' ? t.spanish : t.english}
      onClick={() => setLanguage(nextLanguage)}>{t[nextLanguage]}</button>
    <button className="theme-toggle" onClick={toggleTheme}
      aria-label={theme === 'day' ? t.switchToNight : t.switchToDay}
      title={theme === 'day' ? t.switchToNight : t.switchToDay}>
      <img src={`${import.meta.env.BASE_URL}img/sprites/${theme === 'day' ? 'honorball.png' : 'ultraball.webp'}`}
        alt="" width="28" height="28" />
    </button>
  </header>
}
