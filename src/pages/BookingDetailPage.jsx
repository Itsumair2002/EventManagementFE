import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getSingleBooking, downloadBookingPDF, getBookingTickets, transferTicket, downloadTicketPDF } from '../store/slices/bookingSlice.js'

function QRCodeDisplay({ value }) {
  if (!value) return null;
  // Visual QR code representation
  const size = 8
  const cells = Array.from({ length: size * size }, (_, i) => {
    const x = i % size
    const y = Math.floor(i / size)
    // Corner squares
    const isCorner =
      (x < 3 && y < 3) || (x > 4 && y < 3) || (x < 3 && y > 4)
    const hash = (value.charCodeAt(i % value.length) + x * 7 + y * 13) % 3
    return { on: isCorner || hash === 0, x, y }
  })

  return (
    <div className="qr-pulse inline-block p-4 bg-surface rounded-2xl">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {cells.map((c, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-sm ${c.on ? 'bg-canvas' : 'bg-surface'}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function BookingDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentBooking, tickets, loading } = useSelector(s => s.booking)
  const { user } = useSelector(state => state.auth)
  
  const [isDownloading, setIsDownloading] = useState(false)
  const [activeTicketId, setActiveTicketId] = useState(null)
  
  // Transfer state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [transferEmail, setTransferEmail] = useState('')
  const [ticketToTransfer, setTicketToTransfer] = useState(null)
  const [isTransferring, setIsTransferring] = useState(false)
  const [transferError, setTransferError] = useState('')

  useEffect(() => {
    if (id) {
      dispatch(getSingleBooking(id))
      dispatch(getBookingTickets(id))
    }
  }, [id, dispatch])

  const handleDownload = () => {
    setIsDownloading(true)
    dispatch(downloadBookingPDF(id))
      .unwrap()
      .then(() => {
        console.log("Download successful");
      })
      .catch((err) => {
        console.error("Download failed:", err);
        alert(err || "Failed to download PDF. Please try again.");
      })
      .finally(() => {
        setIsDownloading(false)
      })
  }

  const handleTransferSubmit = (e) => {
    e.preventDefault()
    if (!transferEmail.trim()) {
      setTransferError('Email is required')
      return
    }

    setIsTransferring(true)
    setTransferError('')

    dispatch(transferTicket({ ticketId: ticketToTransfer._id, email: transferEmail.trim() }))
      .unwrap()
      .then(() => {
        setIsTransferModalOpen(false)
        setTransferEmail('')
        setTicketToTransfer(null)
        // Refresh tickets
        dispatch(getBookingTickets(id))
        alert('Ticket successfully transferred!')
      })
      .catch((err) => {
        setTransferError(err || 'Failed to transfer ticket')
      })
      .finally(() => {
        setIsTransferring(false)
      })
  }

  const booking = currentBooking

  if (loading && !booking) return (
    <div className="text-center py-20 animate-pulse">
      <p className="text-fg-muted mb-4">Loading booking details...</p>
    </div>
  )

  if (!booking) return (
    <div className="text-center py-20">
      <p className="text-fg-muted mb-4">Booking not found</p>
      <Link to="/my-bookings" className="text-primary">← Back to Bookings</Link>
    </div>
  )

  const title = booking.eventId?.eventName || booking.eventTitle || 'Unknown Event'
  const dateStr = booking.eventId?.eventDate || booking.eventDate || new Date()
  const venue = booking.eventId?.venue || booking.eventVenue || 'Venue not specified'
  const ticketsCount = booking.numberOfTickets || booking.tickets || 1
  const amount = booking.totalAmount || 0
  const bookingId = booking._id || booking.id
  const bookedAtStr = booking.createdAt || booking.bookedAt || new Date()

  // Determine active QR display
  const activeTicket = tickets.find(t => t._id === activeTicketId) || tickets[0] || null
  const qrUrl = activeTicket ? activeTicket.qrCodeUrl : booking.qrCodeUrl
  const qrData = activeTicket ? activeTicket.qrCodeData : (booking.qrCodeData || booking.qrCode || 'NO-QR')

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      <Link to="/my-bookings" className="inline-flex items-center gap-1 text-fg-muted text-sm hover:text-fg mb-6 transition-colors font-mono">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        // BACK TO MY BOOKINGS
      </Link>

      {/* Ticket Card */}
      <div className="glass-card rounded-3xl border border-line overflow-hidden shadow-card">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-purple-600/15 p-6 border-b border-line">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display font-black text-2xl text-fg mb-2">{title}</h1>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold capitalize ${
                booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {booking.status || 'confirmed'}
              </span>
            </div>
            <div className="text-right shrink-0">
              <p className="text-fg-subtle text-xs font-mono mb-1">#{bookingId.substring(18).toUpperCase()}</p>
              <p className="text-primary font-black text-2xl">₹{amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Details */}
            <div className="space-y-5">
              {[
                { label: 'Event Date & Time', value: new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                { label: 'Venue Location', value: venue },
                { label: 'Purchase Summary', value: `${ticketsCount} Ticket${ticketsCount !== 1 ? 's' : ''} bought` },
                { label: 'Transaction Date', value: new Date(bookedAtStr).toLocaleDateString('en-IN') },
              ].map((item, i) => (
                <div key={i} className="border-l-2 border-primary/20 pl-3">
                  <p className="text-fg-subtle text-xs uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-fg text-sm font-semibold leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-fg/[0.01] border border-line">
              <span className="text-[10px] font-mono text-primary font-bold mb-3 tracking-widest">// ACTIVE SCANNABLE</span>
              {qrUrl ? (
                <img src={qrUrl} alt="QR Code" className="w-36 h-36 rounded-xl border border-line p-1.5 bg-white" />
              ) : (
                <QRCodeDisplay value={qrData} />
              )}
              {activeTicket && (
                <div className="mt-3 text-center">
                  <p className="text-fg font-bold text-xs">{activeTicket.ticketCode}</p>
                  <p className="text-fg-subtle text-[10px] mt-0.5 capitalize">Status: {activeTicket.status}</p>
                </div>
              )}
            </div>
          </div>

          <hr className="border-line my-6" />

          {/* Full Booking Actions */}
          <div className="flex gap-3">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-bold hover:bg-primary/20 transition-all disabled:opacity-50"
            >
              {isDownloading ? 'Downloading Receipt...' : 'Download Invoice Receipt'}
            </button>
          </div>

          {/* Individual Tickets Section */}
          {tickets && tickets.length > 0 && (
            <div className="mt-8 pt-8 border-t border-line">
              <h3 className="font-display font-bold text-lg text-fg mb-4 tracking-tight">// Manage Individual Admission Seats</h3>
              <p className="text-fg-muted text-xs mb-4">Click a ticket card to select and preview its unique scannable check-in QR code above.</p>
              
              <div className="grid grid-cols-1 gap-3">
                {tickets.map((ticket, index) => {
                  const isOwner = ticket.ownerEmail.toLowerCase() === user?.email?.toLowerCase();
                  const isActive = activeTicket?._id === ticket._id;
                  
                  return (
                    <div 
                      key={ticket._id} 
                      onClick={() => setActiveTicketId(ticket._id)}
                      className={`glass-card rounded-2xl p-4 border transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                        isActive ? 'border-primary shadow-glow-sm bg-primary/[0.03]' : 'border-line hover:border-fg/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-primary">{ticket.ticketCode}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full capitalize font-bold border ${
                            ticket.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            ticket.status === 'transferred' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-fg text-sm font-semibold mt-1.5">Seat Admission #{index + 1}</p>
                        <p className="text-fg-subtle text-xs mt-0.5">
                          Owner: <span className="font-medium text-fg-muted">{isOwner ? 'You' : ticket.ownerEmail}</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end shrink-0">
                        {ticket.status === 'active' && (isOwner || booking.userId === user?._id) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTicketToTransfer(ticket);
                              setIsTransferModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-md shadow-primary/20 transition-all"
                          >
                            Transfer to Friend
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(downloadTicketPDF({ ticketId: ticket._id, ticketCode: ticket.ticketCode }));
                          }}
                          className="p-2 rounded-xl border border-line hover:bg-fg/[0.03] text-fg-muted hover:text-fg transition-all"
                          title="Download Ticket PDF"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      {isTransferModalOpen && ticketToTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card max-w-md w-full rounded-3xl border border-line p-6 shadow-card-lg animate-fade-up">
            <h3 className="font-display font-black text-xl text-fg mb-2">Transfer Ticket</h3>
            <p className="text-fg-muted text-xs mb-4 leading-relaxed">
              You are transferring ticket <strong className="text-primary font-mono">{ticketToTransfer.ticketCode}</strong>. Once sent, you will no longer own or be able to scan this ticket at the venue.
            </p>
            
            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-fg-muted text-xs font-semibold uppercase tracking-wider mb-1">Friend's Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="friend@example.com"
                  value={transferEmail}
                  onChange={(e) => setTransferEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-canvas border border-line focus:border-primary text-fg text-sm placeholder:text-fg-subtle"
                />
              </div>
              
              {transferError && (
                <p className="text-red-400 text-xs font-semibold">{transferError}</p>
              )}
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsTransferModalOpen(false)
                    setTransferEmail('')
                    setTicketToTransfer(null)
                    setTransferError('')
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-line text-fg-muted hover:bg-fg/[0.02] text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTransferring}
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                >
                  {isTransferring ? 'Sending Ticket...' : 'Confirm Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
