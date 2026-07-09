import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice.js'
import ThemeToggle from '../ui/ThemeToggle.jsx'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Events', path: '/events' },
  { label: 'About', path: '/about' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { isAuthenticated, user, role } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setProfileOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas/75 backdrop-blur-xl border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display font-bold text-sm shadow-glow-sm group-hover:scale-105 transition-transform">
              V
            </div>
            <span className="font-display font-bold text-xl text-fg tracking-tight">
              Vibe <span className="gradient-text">Check</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'text-primary bg-primary/10'
                    : 'text-fg-muted hover:text-fg hover:bg-fg/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-primary text-sm font-medium hover:bg-brand-500/20 transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    Admin
                  </Link>
                )}
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface border border-line hover:border-primary/40 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                      {(user?.fullName?.[0] || user?.name?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-fg">{user?.fullName || user?.name || 'User'}</span>
                    <svg className={`w-3.5 h-3.5 text-fg-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 z-20 glass-card rounded-xl shadow-card-lg overflow-hidden">
                        <div className="px-4 py-3 border-b border-line">
                          <p className="text-sm font-semibold text-fg truncate">{user?.fullName || user?.name || 'User'}</p>
                          <p className="text-xs text-fg-subtle truncate">{user?.email || ''}</p>
                        </div>
                        <Link to="/my-bookings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-fg-muted hover:bg-fg/5 hover:text-fg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                          My Bookings
                        </Link>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-fg-muted hover:bg-fg/5 hover:text-fg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          Profile
                        </Link>
                        <hr className="border-line my-1" />
                        <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block px-4 py-2 text-sm font-medium text-fg-muted hover:text-fg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-fg text-sm font-semibold transition-all hover:shadow-glow-sm"
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-fg/5"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-line bg-surface/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === link.path
                    ? 'text-primary bg-primary/10'
                    : 'text-fg-muted hover:text-fg hover:bg-fg/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-fg-muted hover:text-fg hover:bg-fg/5">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
