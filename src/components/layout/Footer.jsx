import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-display font-bold text-sm">
                V
              </div>
              <span className="font-display font-bold text-xl text-fg">
                Vibe <span className="gradient-text">Check</span>
              </span>
            </Link>
            <p className="text-fg-muted text-sm leading-relaxed">
              Smart event discovery and booking powered by QR technology.
            </p>
            <div className="flex gap-3 mt-4">
              {['twitter', 'instagram', 'linkedin'].map(s => (
                <a key={s} href="#" className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-fg-muted hover:text-primary hover:border-brand-500/30 transition-all">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Explore', links: ['Events', 'Categories', 'Venues', 'Organizers'] },
            { title: 'Company', links: ['About', 'Careers', 'Press', 'Blog'] },
            { title: 'Support', links: ['Help Center', 'Contact', 'Privacy', 'Terms'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-fg font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-fg-muted text-sm hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-line my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-fg-subtle text-xs">
            © 2026 Vibe Check. All rights reserved.
          </p>
          <p className="text-fg-subtle text-xs font-mono">
            v2.0.0 — Built with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  )
}
