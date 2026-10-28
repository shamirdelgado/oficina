import { editVisitor } from '../state/visitor'
import { useLanguage } from '../i18n'

export function TopBar() {
  const { language, setLanguage, t } = useLanguage()
  return <header className="top-bar">
    <a className="back-link" href={`https://shamirdelgado.github.io/?lang=${language}`}>
      <span className="back-arrow" aria-hidden="true">↖</span>
      <span className="back-full">{t.back}</span>
      <span className="back-short">{t.backShort}</span>
    </a>
    <button className="change-name" onClick={editVisitor}>{t.changeName}</button>
    <div className="language-switch" role="group" aria-label={t.language}>
      {(['es', 'en'] as const).map(code => <button key={code} lang={code}
        aria-label={code === 'es' ? t.spanish : t.english} aria-pressed={language === code}
        onClick={() => setLanguage(code)}>{t[code]}</button>)}
    </div>
  </header>
}
