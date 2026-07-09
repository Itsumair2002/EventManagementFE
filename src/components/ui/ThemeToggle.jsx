import { useTheme } from '../../hooks/useTheme.js'

// Sun/moon toggle. `variant="icon"` is a compact circular button (navbars),
// anything else renders a labelled pill.
export default function ThemeToggle({ variant = 'icon', className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  const Icon = isDark ? (
    // Sun — click to go light
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ) : (
    // Moon — click to go dark
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg hover:border-primary/40 ${className}`}
        aria-label="Toggle color theme"
      >
        {Icon}
        <span>{isDark ? 'Light' : 'Dark'} mode</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-fg-muted hover:text-primary hover:border-primary/40 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {Icon}
    </button>
  )
}
