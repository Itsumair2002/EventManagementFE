import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EventCard from '../ui/EventCard.jsx'
import { fetchAIRecommendations } from '../../store/slices/aiSlice.js'

const RecommendationSkeleton = () => (
  <div className="glass-card rounded-2xl overflow-hidden border border-line animate-pulse">
    <div className="h-44 bg-fg/10" />
    <div className="p-4 space-y-4">
      <div className="h-5 bg-fg/10 rounded-lg w-3/4" />
      <div className="h-4 bg-fg/5 rounded-lg w-full" />
      <div className="h-4 bg-fg/5 rounded-lg w-2/3" />
    </div>
  </div>
)

export default function AIRecommendations({ compact = false }) {
  const dispatch = useDispatch()
  const {
    recommendations,
    loadingRecommendations,
    recommendationError,
    recommendationSource,
  } = useSelector((state) => state.ai)

  useEffect(() => {
    dispatch(fetchAIRecommendations())
  }, [dispatch])

  if (!loadingRecommendations && recommendationError) {
    return null
  }

  if (!loadingRecommendations && recommendations.length === 0) {
    return null
  }

  return (
    <section className={compact ? 'py-8' : 'py-20 bg-surface/30'}>
      <div className={compact ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary text-sm font-mono mb-2">// EVENTMATE AI</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-fg">
              Recommended For You
            </h2>
            <p className="text-fg-muted text-sm mt-2 max-w-2xl">
              Personalized picks based on your interests, booking history, location signals, and live event availability.
            </p>
          </div>
          {recommendationSource && (
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/10 text-primary text-xs font-mono uppercase">
              AI matched
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loadingRecommendations ? (
            Array(3).fill(0).map((_, index) => <RecommendationSkeleton key={index} />)
          ) : (
            recommendations.slice(0, compact ? 3 : 6).map((item) => (
              <div key={item.event._id} className="space-y-3">
                <EventCard event={item.event} />
                <div className="glass-card rounded-xl p-3 border border-brand-500/10">
                  <p className="text-xs text-primary font-mono mb-1">WHY EVENTMATE PICKED THIS</p>
                  <p className="text-sm text-fg-muted leading-relaxed">{item.reason}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
