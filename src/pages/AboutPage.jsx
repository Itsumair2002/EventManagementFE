export default function AboutPage() {

  return (
    <div>
      {/* Hero */}
      <section className="py-24 bg-hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary text-sm font-mono mb-2">// ABOUT US</p>
          <h1 className="font-display font-black text-5xl md:text-6xl text-fg mb-6">
            Redefining the{' '}
            <span className="gradient-text">Event Experience</span>
          </h1>
          <p className="text-fg-muted text-xl max-w-2xl mx-auto leading-relaxed">
            Vibe Check was born from a simple idea: events should be easy to discover, easy to book,
            and easy to attend. We're making that a reality for millions across India.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary text-sm font-mono mb-2">// OUR STORY</p>
            <h2 className="font-display font-bold text-3xl text-fg mb-4">Built for event lovers, by event lovers</h2>
            <p className="text-fg-muted leading-relaxed mb-4">
              Founded in 2023, Vibe Check started as a small project to solve the chaos of event ticketing.
              Long queues, paper tickets, lost bookings — we've all been there.
            </p>
            <p className="text-fg-muted leading-relaxed">
              Today, we serve 50,000+ users across 200+ cities with our smart QR-based ticketing platform
              that makes event attendance seamless from discovery to entry.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🎯', title: 'Our Mission', desc: 'Make live experiences accessible and seamless for everyone.' },
              { icon: '👁️', title: 'Our Vision', desc: 'To be India\'s most trusted event platform.' },
              { icon: '💡', title: 'Innovation', desc: 'QR-based entry that works offline and prevents fraud.' },
              { icon: '🤝', title: 'Community', desc: '200+ cities, 1200+ events, one platform.' },
            ].map((c, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-line">
                <div className="text-2xl mb-2">{c.icon}</div>
                <h4 className="text-fg font-semibold text-sm mb-1">{c.title}</h4>
                <p className="text-fg-muted text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
