import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getUserBookings } from '../store/slices/bookingSlice.js'

const statusColors = {
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
}

export default function MyBookingsPage() {
  const { bookings, loading } = useSelector(s => s.booking)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserBookings())
  }, [dispatch])

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary text-sm font-mono mb-1">// MY ACCOUNT</p>
        <h1 className="font-display font-bold text-3xl text-fg">My Bookings</h1>
        <p className="text-fg-muted text-sm mt-1">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total</p>
      </div>

      {loading && bookings.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl border border-line">
          <h3 className="font-display font-medium text-xl text-fg mb-2 animate-pulse">Loading your bookings...</h3>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl border border-line">
          <div className="text-5xl mb-4">🎟️</div>
          <h3 className="font-display font-bold text-2xl text-fg mb-2">No bookings yet</h3>
          <p className="text-fg-muted mb-6">Discover and book amazing events</p>
          <Link to="/events" className="px-6 py-3 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-400 transition-colors">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => {
            const bookingId = booking._id || booking.id
            const title = booking.eventId?.eventName || booking.eventTitle || 'Unknown Event'
            const dateStr = booking.eventId?.eventDate || booking.eventDate || new Date()
            const venue = booking.eventId?.venue || booking.eventVenue || 'Venue not specified'
            const ticketsCount = booking.numberOfTickets || booking.tickets || 1
            const amount = booking.totalAmount || 0

            return (
              <Link
                key={bookingId}
                to={`/my-bookings/${bookingId}`}
                className="block glass-card glass-card-hover rounded-2xl p-5 border border-line group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-fg group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border capitalize font-medium ${statusColors[booking.status] || statusColors.confirmed}`}>
                        {booking.status || 'confirmed'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-fg-muted">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        {venue}
                      </span>
                      <span className="flex items-center gap-1">
                        🎟️ {ticketsCount} ticket{ticketsCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-fg font-bold">₹{amount.toLocaleString()}</p>
                      <p className="text-fg-subtle text-xs font-mono">{bookingId}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl glass-card border border-line flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
