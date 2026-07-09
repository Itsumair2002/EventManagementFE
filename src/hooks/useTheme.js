import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

const getSystemPrefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

// Resolve the initial theme: an explicit saved choice wins, otherwise follow
// the OS preference. The inline script in index.html already applied the class
// before paint; this just keeps React in sync.
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return getSystemPrefersDark() ? 'dark' : 'light'
}

const applyTheme = (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // If the user hasn't made an explicit choice, follow live OS changes.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) setTheme(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return { theme, toggleTheme, isDark: theme === 'dark' }
}
