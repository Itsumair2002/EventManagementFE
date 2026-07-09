import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice.js'
import ThemeToggle from '../ui/ThemeToggle.jsx'

const adminLinks = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: 'Events',
    path: '/admin/events',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Bookings',
    path: '/admin/bookings',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    path: '/admin/analytics',
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

export default function AdminSidebar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)

  return (
    <aside className="w-60 min-h-screen bg-surface border-r border-line flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-line">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xs">V</div>
          <span className="font-display font-bold text-lg text-fg">Vibe <span className="gradient-text">Check</span></span>
        </Link>
        <span className="ml-2 text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {adminLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              location.pathname === link.path
                ? 'bg-primary/12 text-primary border border-primary/20'
                : 'text-fg-muted hover:text-fg hover:bg-fg/5'
            }`}
          >
            <span className={location.pathname === link.path ? 'text-primary' : 'text-fg-subtle'}>
              {link.icon}
            </span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* User Info */}
      <div className="px-3 pb-4">
        <ThemeToggle variant="pill" className="mb-2 w-full justify-center" />
        <div className="flex items-center gap-3 p-3 rounded-xl glass-card">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-brand-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-fg text-sm font-medium truncate">{user?.name || 'Admin'}</p>
            <p className="text-fg-muted text-xs truncate">{user?.email || 'admin@vibecheck.com'}</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
          Logout
        </button>
      </div>
    </aside>
  )
}
