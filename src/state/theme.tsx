import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
import type { ReactNode } from 'react'

type Theme = 'day' | 'night'

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem('tema')
    return value === 'day' || value === 'night' ? value : null
  } catch {
    return null
  }
}

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => storedTheme() ?? 'night')

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'day' ? '#f3f0f9' : '#0e0a17')
  }, [theme])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'tema' && event.key !== null) return
      const saved = storedTheme()
      setTheme(saved ?? 'night')
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'day' ? 'night' : 'day'
    setTheme(next)
    try { localStorage.setItem('tema', next) } catch { /* El tema sigue disponible sin almacenamiento. */ }
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('ThemeProvider')
  return context
}
