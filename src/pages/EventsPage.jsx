import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import EventCard from '../components/ui/EventCard.jsx'
import { fetchEvents } from '../store/slices/EventSlice.js'
import { fetchCategories } from '../store/slices/CategorySlice.js'
import AIRecommendations from '../components/ai/AIRecommendations.jsx'

const sortOptions = ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Date: Soonest']

export default function EventsPage() {
  const { eventList, loading, error } = useSelector(state => state?.event)
  const { categoryList, loading: catLoading, error: catError } = useSelector(state => state?.category)
  const dispatch = useDispatch()
  
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ category: 'All', sortBy: 'Popularity' })

  useEffect(() => {
    dispatch(fetchEvents())
    dispatch(fetchCategories())
  }, [dispatch])

  const dynamicCategories = ['All', ...(categoryList?.categories?.map(c => c.categoryName) || [])]
  const categories = dynamicCategories.length > 1 ? dynamicCategories : ['All', 'Music', 'Tech', 'Art', 'Comedy', 'Sports', 'Food'];

  const eventsToFilter = Array.isArray(eventList?.events) ? eventList.events : [];

  let filtered = eventsToFilter.filter(e => {
    const catName = typeof e.category === 'object' && e.category !== null 
      ? e.category.categoryName 
      : (e.category || 'General');

    const matchCat = filters.category === 'All' || catName === filters.category;
    const matchSearch = !search || 
      e.eventName?.toLowerCase().includes(search.toLowerCase()) || 
      e.venue?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  })

  // Apply sorting
  filtered.sort((a, b) => {
    if (filters.sortBy === 'Price: Low to High') {
      return (a.price || 0) - (b.price || 0);
    } else if (filters.sortBy === 'Price: High to Low') {
      return (b.price || 0) - (a.price || 0);
    } else if (filters.sortBy === 'Date: Soonest') {
      return new Date(a.eventDate || a.createdAt || Date.now()) - new Date(b.eventDate || b.createdAt || Date.now());
    }
    // Default / Popularity fallback
    const occA = 1 - (a.availableSeats || 0) / (a.totalSeats || 1);
    const occB = 1 - (b.availableSeats || 0) / (b.totalSeats || 1);
    return occB - occA; // Higher occupancy = more popular
  });

  return (
    <div className="py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-primary text-sm font-mono mb-1">// EXPLORE</p>
          <h1 className="font-display font-bold text-4xl text-fg">All Events</h1>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border border-line focus-within:border-brand-500/40 transition-all">
            <svg className="w-4 h-4 text-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events, venues..."
              className="flex-1 bg-transparent text-sm text-fg placeholder-fg-subtle outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border border-line hover:border-brand-500/30 text-fg text-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filters
          </button>
          <select
            value={filters.sortBy}
            onChange={e => setFilters({ ...filters, sortBy: e.target.value })}
            className="px-4 py-2.5 rounded-xl glass-card border border-line text-sm text-fg outline-none bg-transparent cursor-pointer hover:border-brand-500/30 transition-all [&>option]:bg-surface"
          >
            {sortOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div className="flex gap-2 flex-wrap mb-8 min-h-[42px]">
          {catLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="w-24 h-10 rounded-xl bg-fg/5 animate-pulse border border-line" />
            ))
          ) : catError ? (
            <span className="text-red-400 text-xs italic">Failed to load categories</span>
          ) : (
            categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilters({ ...filters, category: cat })}
                className={`category-chip px-4 py-2 rounded-xl text-sm border transition-all ${
                  filters.category === cat
                    ? 'active bg-brand-500 text-dark-900 border-brand-500 font-semibold'
                    : 'border-line text-fg-muted glass-card'
                }`}
              >
                {cat}
              </button>
            ))
          )}
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl glass-card border border-line mb-6">
            <div>
              <label className="block text-xs text-fg-muted mb-1.5 font-mono">Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-sm text-fg outline-none focus:border-brand-500/50 transition-all [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs text-fg-muted mb-1.5 font-mono">Location</label>
              <input
                type="text"
                placeholder="Mumbai, Delhi, Bangalore..."
                className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-sm text-fg placeholder-fg-subtle outline-none focus:border-brand-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-fg-muted mb-1.5 font-mono">Price Range</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min ₹" className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-sm text-fg placeholder-fg-subtle outline-none focus:border-brand-500/50 transition-all" />
                <span className="text-fg-subtle">—</span>
                <input type="number" placeholder="Max ₹" className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-sm text-fg placeholder-fg-subtle outline-none focus:border-brand-500/50 transition-all" />
              </div>
            </div>
          </div>
        )}

        <AIRecommendations compact />

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-fg-muted text-sm">{filtered.length} event{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden border border-line animate-pulse">
                <div className="aspect-[16/10] bg-fg/10" />
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center"><div className="w-16 h-4 bg-fg/10 rounded-full" /><div className="w-8 h-4 bg-fg/10 rounded-full" /></div>
                  <div className="space-y-2"><div className="w-full h-5 bg-fg/10 rounded-lg" /><div className="w-2/3 h-5 bg-fg/10 rounded-lg" /></div>
                  <div className="flex gap-2 pt-2"><div className="w-4 h-4 bg-fg/10 rounded-full" /><div className="w-24 h-4 bg-fg/5 rounded-md" /></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full py-16 text-center glass-card rounded-3xl border border-red-500/20 bg-red-500/5">
              <div className="text-3xl mb-4">⚠️</div>
              <h3 className="text-fg font-bold text-xl mb-2">Failed to load events</h3>
              <p className="text-fg-muted mb-6">{error?.message || "An error occurred while fetching events."}</p>
              <button onClick={() => dispatch(fetchEvents())} className="px-6 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-400 transition-all">Retry</button>
            </div>
          ) : (
            <>
              {filtered.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-display font-bold text-2xl text-fg mb-2">No events found</h3>
                  <p className="text-fg-muted">Try adjusting your filters or search terms</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
