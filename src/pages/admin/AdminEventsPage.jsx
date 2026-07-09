import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resolveEventImage } from '../../utils/media.js'

export default function AdminEventsPage() {
  const { eventList, loading } = useSelector(s => s.event)
  const events = Array.isArray(eventList?.events) ? eventList.events : [];
  
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = events.filter(e =>
    !search || e.eventName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-fg-muted text-sm font-mono mb-1">// MANAGE</p>
          <h1 className="font-display font-bold text-3xl text-fg">Events</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create Event
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border border-line mb-5 max-w-sm">
        <svg className="w-4 h-4 text-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search events..."
          className="bg-transparent text-sm text-fg placeholder-fg-subtle outline-none flex-1"
        />
      </div>

      <div className="glass-card rounded-2xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr className="border-b border-line">
                {['Event', 'Category', 'Date', 'Venue', 'Price', 'Seats', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs text-fg-muted font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(event => {
                const imageUrl = resolveEventImage(event);

                const categoryName = typeof event.category === 'object' && event.category !== null 
                  ? event.category.categoryName 
                  : (event.category || 'General');

                return (
                  <tr key={event._id} className="border-b border-line">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-sm text-fg font-medium max-w-xs truncate">{event.eventName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3"><span className="tag-badge">{categoryName}</span></td>
                    <td className="px-5 py-3 text-sm text-fg-muted whitespace-nowrap">
                      {new Date(event.eventDate || event.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-5 py-3 text-sm text-fg-muted max-w-xs truncate">{event.venue}</td>
                    <td className="px-5 py-3 text-sm text-fg">₹{(event.price || 0).toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-fg-muted">{event.availableSeats}/{event.totalSeats}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg text-fg-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={() => dispatch(deleteEvent(event._id))}
                        className="p-1.5 rounded-lg text-fg-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-3xl p-6 border border-line w-full max-w-lg">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display font-bold text-xl text-fg">Create New Event</h3>
              <button onClick={() => setShowModal(false)} className="text-fg-muted hover:text-fg p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Event Title', placeholder: 'Title', full: true },
                { label: 'Category', placeholder: 'Category' },
                { label: 'Date', placeholder: 'Date', type: 'date' },
                { label: 'Time', placeholder: 'Time', type: 'time' },
                { label: 'Venue', placeholder: 'Venue', full: true },
                { label: 'Price (₹)', placeholder: '999' },
                { label: 'Total Seats', placeholder: '500' },
              ].map((f, i) => (
                <div key={i} className={f.full ? 'col-span-2' : ''}>
                  <label className="block text-xs text-fg-muted mb-1">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    className="input-brand w-full px-3 py-2 rounded-xl bg-elevated border border-line text-fg placeholder-fg-subtle text-sm outline-none transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium transition-all">
                Create Event
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl glass-card border border-line text-fg-muted text-sm hover:text-fg transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
