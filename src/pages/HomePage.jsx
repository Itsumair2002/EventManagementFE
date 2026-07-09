import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import EventCard from '../components/ui/EventCard.jsx'
import { fetchCategories } from '../store/slices/CategorySlice.js'
import { fetchEvents } from '../store/slices/EventSlice.js'
import AIRecommendations from '../components/ai/AIRecommendations.jsx'
import { resolveEventImage, eventPlaceholder, categoryMeta } from '../utils/media.js'

const stats = [
  { value: '50K+', label: 'Happy attendees' },
  { value: '1.2K', label: 'Events hosted' },
  { value: '98%', label: 'Satisfaction' },
  { value: '200+', label: 'Cities' },
]

const Eyebrow = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
    {children}
  </span>
)

export default function HomePage() {
  const { eventList, loading: eventsLoading, error: eventsError } = useSelector((state) => state?.event)
  const { categoryList, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state?.category)
  const [query, setQuery] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchEvents())
  }, [dispatch])

  const events = eventList?.events || []
  const heroImages = events.slice(0, 4)

  const EventSkeleton = () => (
    <div className="glass-card rounded-2xl overflow-hidden border border-line animate-pulse">
      <div className="h-44 bg-fg/10" />
      <div className="p-4 space-y-3">
        <div className="w-2/3 h-5 bg-fg/10 rounded-lg" />
        <div className="w-full h-4 bg-fg/5 rounded-lg" />
        <div className="w-1/2 h-4 bg-fg/5 rounded-lg" />
      </div>
    </div>
  )

  const ErrorState = ({ message, onRetry }) => (
    <div className="col-span-full py-10 flex flex-col items-center justify-center glass-card rounded-3xl border border-red-500/20 bg-red-500/5">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-2xl mb-4">⚠️</div>
      <h3 className="text-fg font-semibold mb-2">Something went wrong</h3>
      <p className="text-fg-muted text-sm mb-6 max-w-md text-center">
        {message || 'We could not load the data. Please check your connection and try again.'}
      </p>
      <button onClick={onRetry} className="px-6 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-fg text-sm font-medium transition-all">
        Try Again
      </button>
    </div>
  )

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-24 w-[32rem] h-[32rem] rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute top-10 right-0 w-[28rem] h-[28rem] rounded-full bg-fuchsia-500/10 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            {/* Left: copy */}
            <div>
              <Eyebrow>Smart ticketing platform</Eyebrow>

              <h1 className="font-display font-extrabold text-[2.6rem] leading-[1.06] sm:text-6xl text-fg mt-6 tracking-tight">
                Where great
                <br />
                nights <span className="gradient-text">begin.</span>
              </h1>

              <p className="text-fg-muted text-lg max-w-xl mt-6 leading-relaxed">
                Discover concerts, conferences and everything in between. Book in seconds,
                and walk in with a single QR code — no queues, no printing.
              </p>

              {/* Search */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-8 flex items-center gap-2 p-2 pl-4 rounded-2xl bg-surface border border-line shadow-card focus-within:border-primary/50 focus-within:shadow-glow-sm transition-all max-w-xl"
              >
                <svg className="w-5 h-5 text-fg-subtle shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Search events, venues, artists…"
                  className="flex-1 min-w-0 bg-transparent text-sm text-fg placeholder-fg-subtle outline-none"
                />
                <Link
                  to={`/events${query ? `?q=${encodeURIComponent(query)}` : ''}`}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-fg text-sm font-semibold transition-colors shrink-0"
                >
                  Search
                </Link>
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link to="/events" className="text-sm font-semibold text-fg hover:text-primary inline-flex items-center gap-1.5 transition-colors">
                  Browse all events
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <div className="flex items-center gap-2 text-sm text-fg-muted">
                  <div className="flex -space-x-2">
                    {['bg-pink-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500'].map((c, i) => (
                      <span key={i} className={`w-6 h-6 rounded-full ring-2 ring-canvas ${c}`} />
                    ))}
                  </div>
                  Joined by 50,000+ people
                </div>
              </div>
            </div>

            {/* Right: live event collage */}
            <div className="relative">
              {heroImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-8">
                    {heroImages.slice(0, 2).map((ev) => (
                      <HeroTile key={ev._id} event={ev} />
                    ))}
                  </div>
                  <div className="space-y-4">
                    {heroImages.slice(2, 4).map((ev) => (
                      <HeroTile key={ev._id} event={ev} />
                    ))}
                    {heroImages.length < 3 && <HeroTile event={heroImages[0]} />}
                  </div>
                </div>
              ) : (
                <div className="aspect-square rounded-3xl glass-card border border-line animate-pulse" />
              )}

              {/* Floating stat chip */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 glass-card rounded-2xl px-5 py-3 border border-line shadow-card-lg flex items-center gap-3 whitespace-nowrap">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary text-lg">✦</span>
                <div>
                  <p className="text-fg font-bold text-sm leading-none">{events.length || '200'}+ live events</p>
                  <p className="text-fg-subtle text-xs mt-1">updated in real time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-line bg-surface/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-extrabold text-3xl md:text-4xl text-fg">{stat.value}</div>
                <p className="text-fg-muted text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <Eyebrow>Browse by</Eyebrow>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-fg mt-4">Find your scene</h2>
          </div>
          <Link to="/events" className="text-primary text-sm font-semibold hover:underline hidden md:block">View all →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoriesLoading ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="h-28 glass-card rounded-2xl animate-pulse" />)
          ) : categoriesError ? (
            <ErrorState message={categoriesError?.message || categoriesError} onRetry={() => dispatch(fetchCategories())} />
          ) : (
            categoryList?.categories?.map((cat, i) => {
              const meta = categoryMeta(cat.categoryName)
              return (
                <Link
                  key={i}
                  to={`/events?category=${cat.categoryName}`}
                  className={`group relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br ${meta.grad} p-5 hover:border-primary/40 hover:-translate-y-1 transition-all`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-surface/80 backdrop-blur flex items-center justify-center text-2xl mb-4 shadow-card">
                    {meta.icon}
                  </div>
                  <p className="text-fg font-semibold">{cat.categoryName}</p>
                  <p className="text-fg-subtle text-xs mt-0.5 line-clamp-1">{cat.description || 'Explore events'}</p>
                  <svg className="w-4 h-4 text-primary absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              )
            })
          )}
        </div>
      </section>

      <AIRecommendations />

      {/* ── Featured Events ── */}
      <section className="py-20 bg-surface/40 border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Eyebrow>Handpicked</Eyebrow>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-fg mt-4">Featured events</h2>
            </div>
            <Link to="/events" className="text-primary text-sm font-semibold hover:underline hidden md:block">View all events →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {eventsLoading ? (
              Array(4).fill(0).map((_, i) => <EventSkeleton key={i} />)
            ) : eventsError ? (
              <ErrorState message={eventsError?.message || eventsError} onRetry={() => dispatch(fetchEvents())} />
            ) : (
              events.slice(0, 8).map(event => <EventCard key={event._id} event={event} />)
            )}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex justify-center"><Eyebrow>How it works</Eyebrow></div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-fg mt-4">Book in three simple steps</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Find your event', desc: 'Browse thousands of events filtered by category, city, or date.', icon: '🔍' },
            { step: '02', title: 'Book & pay', desc: 'Pick your tickets and check out securely in a few taps.', icon: '💳' },
            { step: '03', title: 'Enter with QR', desc: 'Get a unique QR code per ticket. Scan it at the venue gate.', icon: '📱' },
          ].map((step, i) => (
            <div key={i} className="glass-card rounded-3xl p-8 border border-line relative">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl mb-5">
                {step.icon}
              </div>
              <div className="absolute top-7 right-7 font-display font-extrabold text-2xl text-primary/15">{step.step}</div>
              <h3 className="font-display font-bold text-xl text-fg mb-2">{step.title}</h3>
              <p className="text-fg-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center">
          <div className="absolute inset-0 opacity-20 hero-grid" />
          <div className="relative">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-4">
              Ready to experience more?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ event-goers who trust Vibe Check for seamless nights out.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-700 font-semibold hover:bg-white/90 transition-all"
            >
              Get started free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Small image tile used in the hero collage.
function HeroTile({ event }) {
  if (!event) return null
  return (
    <Link
      to={`/events/${event._id}`}
      className="group block relative rounded-2xl overflow-hidden border border-line shadow-card aspect-[4/5]"
    >
      <img
        src={resolveEventImage(event)}
        alt={event.eventName}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={(e) => { e.target.onerror = null; e.target.src = eventPlaceholder(event) }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-sm font-semibold leading-tight line-clamp-2">{event.eventName}</p>
        <p className="text-white/70 text-xs mt-1 truncate">{event.venue}</p>
      </div>
    </Link>
  )
}
