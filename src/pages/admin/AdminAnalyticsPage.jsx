export default function AdminAnalyticsPage() {
  const metrics = [
    { title: 'Total Revenue', value: '₹8.6L', trend: '+18%', trendUp: true },
    { title: 'Avg Ticket Price', value: '₹1,249', trend: '+5%', trendUp: true },
    { title: 'Conversion Rate', value: '12.4%', trend: '-1.2%', trendUp: false },
    { title: 'Repeat Buyers', value: '34%', trend: '+8%', trendUp: true },
  ]

  const topEvents = [
    { name: 'TechSummit 2026', revenue: '₹2,33,422', tickets: 78, pct: 88 },
    { name: 'Neon Nights Music', revenue: '₹1,68,344', tickets: 112, pct: 72 },
    { name: 'Marathon Mumbai', revenue: '₹1,12,000', tickets: 112, pct: 55 },
    { name: 'Comedy Night Live', revenue: '₹79,350', tickets: 99, pct: 50 },
    { name: 'Gourmet Food Fest', revenue: '₹51,870', tickets: 74, pct: 38 },
  ]

  return (
    <div>
      <div className="mb-8">
        <p className="text-fg-muted text-sm font-mono mb-1">// INSIGHTS</p>
        <h1 className="font-display font-bold text-3xl text-fg">Analytics</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 border border-line">
            <div className="flex justify-between items-center mb-3">
              <p className="text-fg-muted text-sm">{m.title}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.trendUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {m.trend}
              </span>
            </div>
            <div className="font-display font-bold text-3xl text-fg">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Revenue trend */}
        <div className="glass-card rounded-2xl p-5 border border-line">
          <h3 className="font-semibold text-fg mb-5">Monthly Revenue Trend</h3>
          <div className="flex items-end gap-3 h-36">
            {[30, 45, 38, 60, 55, 80, 72, 90, 85, 95, 78, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md transition-all" style={{
                  height: `${h}%`,
                  background: i === 11 ? 'linear-gradient(180deg, #f97316, #ea580c)' : 'rgba(249,115,22,0.25)'
                }} />
                <span className="text-fg-subtle text-xs">
                  {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="glass-card rounded-2xl p-5 border border-line">
          <h3 className="font-semibold text-fg mb-5">Revenue by Category</h3>
          <div className="space-y-4">
            {[
              { name: 'Music & Concerts', pct: 38, val: '₹3.3L', color: 'bg-pink-500' },
              { name: 'Technology', pct: 27, val: '₹2.3L', color: 'bg-blue-500' },
              { name: 'Sports & Fitness', pct: 18, val: '₹1.5L', color: 'bg-brand-500' },
              { name: 'Comedy', pct: 10, val: '₹86K', color: 'bg-green-500' },
              { name: 'Food & Drinks', pct: 7, val: '₹60K', color: 'bg-amber-500' },
            ].map((c, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-fg-muted flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${c.color} inline-block`} />
                    {c.name}
                  </span>
                  <span className="text-fg font-medium">{c.val}</span>
                </div>
                <div className="h-1.5 rounded-full bg-fg/[0.05] overflow-hidden">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Events */}
      <div className="glass-card rounded-2xl border border-line overflow-hidden">
        <div className="p-5 border-b border-line">
          <h3 className="font-semibold text-fg">Top Performing Events</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr className="border-b border-line">
                {['Event', 'Revenue', 'Tickets Sold', 'Occupancy'].map(h => (
                  <th key={h} className="text-left text-xs text-fg-muted font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topEvents.map((e, i) => (
                <tr key={i} className="border-b border-line">
                  <td className="px-5 py-3 text-sm text-fg font-medium">{e.name}</td>
                  <td className="px-5 py-3 text-sm text-fg">{e.revenue}</td>
                  <td className="px-5 py-3 text-sm text-fg-muted">{e.tickets}</td>
                  <td className="px-5 py-3 w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-fg/[0.05] overflow-hidden">
                        <div className="h-full rounded-full bg-brand-500" style={{ width: `${e.pct}%` }} />
                      </div>
                      <span className="text-xs text-fg-muted w-8 shrink-0">{e.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
