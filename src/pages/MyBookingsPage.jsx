import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getUserBookings, getMyOwnedTickets, downloadTicketPDF } from '../store/slices/bookingSlice.js'

const statusColors = {
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
}

export default function MyBookingsPage() {
  const { bookings, myTransferredTickets, loading } = useSelector(s => s.booking)
  const dispatch = useDispatch()
  
  const [activeTab, setActiveTab] = useState('booked') // 'booked' or 'shared'
  const [selectedTicket, setSelectedTicket] = useState(null)

  useEffect(() => {
    dispatch(getUserBookings())
    dispatch(getMyOwnedTickets())
  }, [dispatch])

  const { user } = useSelector(state => state.auth)

  // Filter out tickets that the user bought themselves (so they only see tickets transferred from others in "Shared with me")
  const actualTransferredTickets = myTransferredTickets.filter(ticket => {
    const buyerIdStr = ticket.buyerId?._id ? ticket.buyerId._id.toString() : ticket.buyerId?.toString();
    const userIdStr = user?._id?.toString();
    return buyerIdStr !== userIdStr;
  })

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <div className="mb-8">
        <p className="text-primary text-sm font-mono mb-1">// MY ACCOUNT</p>
        <h1 className="font-display font-black text-3xl text-fg">My Tickets & Bookings</h1>
        <p className="text-fg-muted text-sm mt-1">Manage event access passes and transfers</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line mb-6 gap-2">
        <button
          onClick={() => setActiveTab('booked')}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-all font-mono uppercase ${
            activeTab === 'booked' ? 'border-primary text-primary' : 'border-transparent text-fg-muted hover:text-fg'
          }`}
        >
          Bookings I Bought ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('shared')}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-all font-mono uppercase ${
            activeTab === 'shared' ? 'border-primary text-primary' : 'border-transparent text-fg-muted hover:text-fg'
          }`}
        >
          Shared With Me ({actualTransferredTickets.length})
        </button>
      </div>

      {/* Bookings List (Tab 1) */}
      {activeTab === 'booked' && (
        <>
          {loading && bookings.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl border border-line animate-pulse">
              <h3 className="font-display font-medium text-lg text-fg">Loading your bookings...</h3>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl border border-line">
              <div className="text-5xl mb-4">🎟️</div>
              <h3 className="font-display font-bold text-2xl text-fg mb-2">No bookings yet</h3>
              <p className="text-fg-muted mb-6">Discover and book amazing events</p>
              <Link to="/events" className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-md shadow-primary/20 transition-all">
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
                          <h3 className="font-bold text-fg group-hover:text-primary transition-colors">
                            {title}
                          </h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize font-bold ${statusColors[booking.status] || statusColors.confirmed}`}>
                            {booking.status || 'confirmed'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-fg-muted">
                          <span className="flex items-center gap-1 font-mono">
                            DATE: {new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            VENUE: {venue}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            SEATS: {ticketsCount}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 self-stretch sm:self-auto justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-fg font-black">₹{amount.toLocaleString()}</p>
                          <p className="text-fg-subtle text-[10px] font-mono">#{bookingId.substring(18).toUpperCase()}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl glass-card border border-line flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </>
      )}

      {/* Shared/Transferred Tickets List (Tab 2) */}
      {activeTab === 'shared' && (
        <>
          {loading && actualTransferredTickets.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl border border-line animate-pulse">
              <h3 className="font-display font-medium text-lg text-fg">Loading transferred tickets...</h3>
            </div>
          ) : actualTransferredTickets.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl border border-line">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="font-display font-bold text-2xl text-fg mb-2">No shared tickets</h3>
              <p className="text-fg-muted mb-6">Tickets shared by friends will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {actualTransferredTickets.map(ticket => {
                const title = ticket.eventId?.eventName || 'Unknown Event'
                const dateStr = ticket.eventId?.eventDate || new Date()
                const venue = ticket.eventId?.venue || 'Venue not specified'

                return (
                  <div
                    key={ticket._id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="block glass-card glass-card-hover rounded-2xl p-5 border border-line group cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-fg group-hover:text-primary transition-colors">
                            {title}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 font-bold capitalize">
                            Transferred Pass
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-fg-muted">
                          <span className="flex items-center gap-1 font-mono">
                            DATE: {new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            VENUE: {venue}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-primary font-bold">
                            CODE: {ticket.ticketCode}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 justify-end self-stretch sm:self-auto">
                        <div className="text-right">
                          <span className="text-[9px] font-mono text-fg-subtle uppercase tracking-wider block">Scan Entry</span>
                          <span className="text-xs font-mono font-bold text-fg-muted">Click to open</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl glass-card border border-line flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card max-w-md w-full rounded-3xl border border-line overflow-hidden shadow-card-lg animate-fade-up">
            <div className="bg-gradient-to-r from-primary/10 to-purple-600/15 p-6 border-b border-line">
              <h3 className="font-display font-black text-xl text-fg">{selectedTicket.eventId?.eventName}</h3>
              <p className="text-primary font-mono text-xs font-bold mt-1">Ticket Code: {selectedTicket.ticketCode}</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-fg/[0.01] border border-line">
                <span className="text-[10px] font-mono text-primary font-bold mb-3 tracking-widest">// SCANNABLE ADMISSION PASS</span>
                {selectedTicket.qrCodeUrl && (
                  <img src={selectedTicket.qrCodeUrl} alt="QR Code" className="w-40 h-40 rounded-xl border border-line p-1.5 bg-white" />
                )}
                <span className="text-fg-subtle text-[10px] uppercase font-mono mt-3">Transferred to: {selectedTicket.ownerEmail}</span>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-fg-muted">Venue</span>
                  <span className="font-semibold text-fg">{selectedTicket.eventId?.venue}</span>
                </div>
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-fg-muted">Date & Time</span>
                  <span className="font-semibold text-fg">
                    {new Date(selectedTicket.eventId?.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 py-2.5 rounded-xl border border-line text-fg-muted hover:bg-fg/[0.02] text-sm font-semibold transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => dispatch(downloadTicketPDF({ ticketId: selectedTicket._id, ticketCode: selectedTicket.ticketCode }))}
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
