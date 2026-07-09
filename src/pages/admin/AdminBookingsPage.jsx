import { useSelector } from 'react-redux'

const statusColors = {
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function AdminBookingsPage() {
  const { bookings } = useSelector(s => s.booking)

  return (
    <div>
      <div className="mb-8">
        <p className="text-fg-muted text-sm font-mono mb-1">// MANAGE</p>
        <h1 className="font-display font-bold text-3xl text-fg">Bookings</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Bookings', value: bookings.length, color: 'text-fg' },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'text-green-400' },
          { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: 'text-red-400' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 border border-line text-center">
            <div className={`text-3xl font-bold font-display ${s.color} mb-1`}>{s.value}</div>
            <p className="text-fg-muted text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr className="border-b border-line">
                {['Booking ID', 'Event', 'Tickets', 'Amount', 'Booked On', 'Status', 'QR'].map(h => (
                  <th key={h} className="text-left text-xs text-fg-muted font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b border-line">
                  <td className="px-5 py-3 text-xs font-mono text-fg-muted">{b.id}</td>
                  <td className="px-5 py-3 text-sm text-fg font-medium max-w-xs truncate">{b.eventTitle}</td>
                  <td className="px-5 py-3 text-sm text-fg-muted">{b.tickets}</td>
                  <td className="px-5 py-3 text-sm text-fg font-medium">₹{b.totalAmount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-fg-muted whitespace-nowrap">
                    {new Date(b.bookedAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border capitalize font-medium ${statusColors[b.status] || ''}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button className="p-1.5 rounded-lg text-fg-muted hover:text-primary hover:bg-brand-500/10 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </button>
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
