import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getSingleBooking, downloadBookingPDF } from '../store/slices/bookingSlice.js'

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
  const { currentBooking, loading } = useSelector(s => s.booking)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(getSingleBooking(id))
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

  const booking = currentBooking

  if (loading) return (
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
  const qrData = booking.qrCodeData || booking.qrCode || 'NO-QR'

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/my-bookings" className="inline-flex items-center gap-1 text-fg-muted text-sm hover:text-fg mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        My Bookings
      </Link>

      {/* Ticket Card */}
      <div className="glass-card rounded-3xl border border-line overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600/20 to-purple-600/20 p-6 border-b border-line">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl text-fg mb-1">{title}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {booking.status || 'confirmed'}
              </span>
            </div>
            <div className="text-right">
              <p className="text-fg-muted text-xs font-mono">{bookingId}</p>
              <p className="text-fg font-bold text-xl mt-1">₹{amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Details */}
            <div className="space-y-4">
              {[
                { label: 'Event Date', value: new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Venue', value: venue },
                { label: 'Tickets', value: `${ticketsCount} ticket${ticketsCount !== 1 ? 's' : ''}` },
                { label: 'Booked On', value: new Date(bookedAtStr).toLocaleDateString('en-IN') },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-fg-muted text-xs mb-0.5">{item.label}</p>
                  <p className="text-fg text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-fg/[0.02] border border-line">
              {booking.qrCodeUrl ? (
                <img src={booking.qrCodeUrl} alt="QR Code" className="w-32 h-32 rounded-xl mb-3" />
              ) : (
                <QRCodeDisplay value={qrData} />
              )}
              <p className="text-fg-muted text-xs mt-3 text-center font-mono">{qrData}</p>
            </div>
          </div>

          <hr className="border-line my-6" />

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-primary text-sm font-medium hover:bg-brand-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                 <>
                   <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                   Downloading...
                 </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
