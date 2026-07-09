import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedTickets, createBookingThunk } from '../store/slices/bookingSlice.js'
import { fetchSingleEvents } from '../store/slices/EventSlice.js'
import { resolveEventImage, eventPlaceholder } from '../utils/media.js'

export default function EventDetailPage() {
  const { id } = useParams()
  const { singleEventData, loading, error } = useSelector(state => state?.event)
  const { isAuthenticated } = useSelector(state => state?.auth)
  const { selectedTickets, loading: bookingLoading } = useSelector(state => state?.booking)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('about')

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleEvents({ id }))
    }
  }, [id, dispatch])

  const event = singleEventData?.events
  
  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin mb-4" />
      <p className="text-fg-muted animate-pulse font-mono text-sm tracking-widest uppercase">Loading Event Details</p>
    </div>
  )

  if (error || !event) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full glass-card rounded-3xl p-8 border border-line text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-3xl mx-auto mb-6">⚠️</div>
        <h3 className="font-display font-bold text-2xl text-fg mb-2">
          {error ? 'Failed to load event' : 'Event not found'}
        </h3>
        <p className="text-fg-muted mb-8 leading-relaxed">
          {error?.message || error || "The event you're looking for might have been cancelled or the link is invalid."}
        </p>
        <div className="flex flex-col gap-3">
          {error && (
            <button 
              onClick={() => dispatch(fetchSingleEvents({ id }))}
              className="w-full py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-all"
            >
              Try Again
            </button>
          )}
          <Link to="/events" className="w-full py-3 rounded-xl glass-card border border-line text-fg font-medium hover:bg-fg/5 transition-all">
            Browse Other Events
          </Link>
        </div>
      </div>
    </div>
  )

  const handleBook = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    try {
      await dispatch(createBookingThunk({ eventId: event._id || event.id, numberOfTickets: selectedTickets })).unwrap()
      navigate('/my-bookings')
    } catch (err) {
      alert(err || 'Failed to book tickets')
    }
  }

  const price = event.price || 0;
  const available = event.availableSeats || 0;
  const totalSeats = event.totalSeats || 1;
  const total = price * selectedTickets;
  const occupancy = Math.round((1 - available / totalSeats) * 100);
  
  const imageUrl = resolveEventImage(event);

  const categoryName = typeof event.category === 'object' && event.category !== null 
    ? event.category.categoryName 
    : (event.category || 'General');

  const eventDateObj = new Date(event.eventDate || event.createdAt || Date.now());
  const dateStr = eventDateObj.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' });
  const timeStr = eventDateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const organizerName = event.createdBy?.name || event.organizer || 'Admin';

  return (
    <div>
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={event.eventName} 
          className="w-full h-full object-cover" 
          onError={(e) => { e.target.onerror = null; e.target.src = eventPlaceholder(event) }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Link to="/events" className="inline-flex items-center gap-1 text-fg-muted text-sm hover:text-fg mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Events
          </Link>
          <div className="flex flex-wrap items-start gap-3">
            <span className="tag-badge">{categoryName}</span>
            {event.tags?.map(tag => (
              <span key={tag} className="text-xs text-fg-muted bg-fg/5 px-2 py-0.5 rounded">#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display font-bold text-3xl md:text-4xl text-fg mb-3">{event.eventName}</h1>
                <div className="flex items-center gap-4 text-fg-muted text-sm">
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <strong className="text-fg">{event.rating || '4.5'}</strong>
                  </span>
                  <span>by {organizerName}</span>
                </div>
              </div>
            </div>

            {/* Meta pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {[
                { icon: '📅', label: 'Date & Time', value: `${dateStr} · ${timeStr}` },
                { icon: '📍', label: 'Venue', value: event.venue || event.location },
                { icon: '🎟️', label: 'Tickets', value: `${available} of ${totalSeats} available` },
              ].map((m, i) => (
                <div key={i} className="glass-card rounded-2xl p-4 border border-line">
                  <div className="text-xl mb-1.5">{m.icon}</div>
                  <p className="text-fg-muted text-xs mb-0.5">{m.label}</p>
                  <p className="text-fg text-sm font-medium">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-5 p-1 rounded-xl glass-card border border-line w-fit">
              {['about', 'venue', 'organizer'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-primary text-primary-fg' : 'text-fg-muted hover:text-fg'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="glass-card rounded-2xl p-6 border border-line">
              {activeTab === 'about' && (
                <div>
                  <h3 className="font-semibold text-fg mb-3">About this Event</h3>
                  <p className="text-fg-muted leading-relaxed">{event.description || 'No description provided.'}</p>
                  <p className="text-fg-muted leading-relaxed mt-3">
                    Join us for an unforgettable experience that will leave you inspired, entertained, and wanting more.
                    This event is designed to bring together like-minded individuals in a world-class venue.
                  </p>
                </div>
              )}
              {activeTab === 'venue' && (
                <div>
                  <h3 className="font-semibold text-fg mb-3">Venue Information</h3>
                  <p className="text-fg-muted">{event.venue}</p>
                  <p className="text-fg-muted text-sm mt-1">{event.location}</p>
                  <div className="mt-4 h-40 rounded-xl bg-fg/[0.03] border border-line flex items-center justify-center">
                    <p className="text-fg-subtle text-sm">Map placeholder</p>
                  </div>
                </div>
              )}
              {activeTab === 'organizer' && (
                <div>
                  <h3 className="font-semibold text-fg mb-3">Organized by</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-primary font-bold uppercase">
                      {organizerName[0]}
                    </div>
                    <div>
                      <p className="text-fg font-medium">{organizerName}</p>
                      <p className="text-fg-muted text-sm">{event.createdBy?.email ? event.createdBy.email : 'Verified Organizer'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card rounded-3xl p-6 border border-line">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-display font-bold text-3xl text-fg">₹{price.toLocaleString()}</span>
                <span className="text-fg-muted text-sm">/ ticket</span>
              </div>

              {/* Occupancy */}
              <div className="mt-4 mb-5">
                <div className="flex justify-between text-xs text-fg-muted mb-1.5">
                  <span>{available} seats left</span>
                  <span>{occupancy}% booked</span>
                </div>
                <div className="h-1.5 rounded-full bg-fg/[0.05] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${occupancy > 80 ? 'bg-red-500' : 'bg-brand-500'}`}
                    style={{ width: `${occupancy}%` }}
                  />
                </div>
              </div>

              <hr className="border-line mb-5" />

              {/* Ticket Count */}
              <div className="mb-5">
                <label className="block text-sm text-fg-muted mb-3">Number of Tickets</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => dispatch(setSelectedTickets(Math.max(1, selectedTickets - 1)))}
                    className="w-9 h-9 rounded-xl glass-card border border-line flex items-center justify-center text-fg hover:border-brand-500/30 transition-all"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-fg font-bold text-xl">{selectedTickets || 1}</span>
                  <button
                    onClick={() => dispatch(setSelectedTickets(Math.min(10, (selectedTickets || 1) + 1)))}
                    className="w-9 h-9 rounded-xl glass-card border border-line flex items-center justify-center text-fg hover:border-brand-500/30 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-4 rounded-2xl bg-brand-500/5 border border-brand-500/15 mb-5">
                <span className="text-fg-muted text-sm">Total Amount</span>
                <span className="text-fg font-bold text-xl">₹{total.toLocaleString()}</span>
              </div>

              <button
                onClick={handleBook}
                disabled={available === 0 || bookingLoading}
                className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-all hover:shadow-glow disabled:opacity-50"
              >
                {bookingLoading ? 'Booking...' : available === 0 ? 'Sold Out' : (isAuthenticated ? 'Book Now' : 'Login to Book')}
              </button>

              <p className="text-center text-fg-subtle text-xs mt-3">Secure payment · Instant QR code</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
