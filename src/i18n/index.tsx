import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { es } from './es'
import { en } from './en'

type Language = 'es' | 'en'
const dictionaries = { es, en }
const LanguageContext = createContext<{
  language: Language
  setLanguage: (language: Language) => void
  t: typeof es
} | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>(() =>
    new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'es',
  )
  const setLanguage = (next: Language) => {
    const url = new URL(window.location.href)
    url.searchParams.set('lang', next)
    window.history.replaceState(null, '', url)
    updateLanguage(next)
  }
  useEffect(() => {
    const onHistory = () => updateLanguage(new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'es')
    window.addEventListener('popstate', onHistory)
    return () => window.removeEventListener('popstate', onHistory)
  }, [])
  const t = dictionaries[language]
  useEffect(() => {
    document.documentElement.lang = language
    document.title = t.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.description)
  }, [language, t])
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('LanguageProvider')
  return context
}
