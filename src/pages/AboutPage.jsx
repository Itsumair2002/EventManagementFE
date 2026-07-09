export default function AboutPage() {
  const team = [
    { name: 'Swastika Roy', role: 'CEO & Co-founder', color: 'from-brand-400 to-brand-700' },
    { name: 'Anikhet Maity', role: 'CTO', color: 'from-purple-400 to-purple-700' },
    { name: 'Zarin Siddiqui', role: 'Head of Design', color: 'from-pink-400 to-pink-700' },
    { name: 'Biprodeep Das', role: 'Head of Marketing', color: 'from-blue-400 to-blue-700' },
    { name: 'Afzal Imam Khan', role: 'Event Manager', color: 'from-blue-400 to-blue-700' },
  ]

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

      {/* Team */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-mono mb-2">// OUR TEAM</p>
            <h2 className="font-display font-bold text-3xl text-fg">Meet the Builders</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="glass-card glass-card-hover rounded-2xl p-6 border border-line text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
                  {member.name[0]}
                </div>
                <h3 className="font-semibold text-fg mb-1">{member.name}</h3>
                <p className="text-fg-muted text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
