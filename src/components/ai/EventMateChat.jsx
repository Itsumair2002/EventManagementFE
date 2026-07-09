import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { sendEventMateMessage } from '../../store/slices/aiSlice.js'
import { fetchEvents } from '../../store/slices/EventSlice.js'

const starterPrompts = [
  'Recommend events for me',
  'Show music events in my city',
  'Find events under 1000',
]

export default function EventMateChat() {
  const dispatch = useDispatch()
  const { chatLoading } = useSelector((state) => state.ai)
  const { eventList } = useSelector((state) => state.event)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi, I am EventMate. Ask me for events by category, city, budget, date, or help with tickets.',
      suggestedEventIds: [],
    },
  ])

  useEffect(() => {
    if (!eventList?.events?.length) {
      dispatch(fetchEvents())
    }
  }, [dispatch, eventList?.events?.length])

  const eventsById = useMemo(() => {
    const events = Array.isArray(eventList?.events) ? eventList.events : []
    return new Map(events.map((event) => [event._id, event]))
  }, [eventList])

  const submitMessage = async (text = input) => {
    const message = text.trim()
    if (!message || chatLoading) return

    setMessages((current) => [...current, { role: 'user', text: message }])
    setInput('')

    try {
      const response = await dispatch(sendEventMateMessage(message)).unwrap()
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: response.reply,
          suggestedEventIds: response.suggestedEventIds || [],
        },
      ])
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: error || 'EventMate could not answer right now. Please try again.',
          suggestedEventIds: [],
        },
      ])
    }
  }

  // Only available to signed-in users — hidden on the public landing page.
  if (!isAuthenticated) return null

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-primary">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <div className="leading-tight">
                <p className="text-fg font-semibold text-sm">EventMate</p>
                <p className="text-[11px] text-fg-muted">Events &amp; tickets assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-lg text-lg leading-none text-fg-muted hover:bg-fg/10 hover:text-fg"
              aria-label="Close EventMate"
            >
              &times;
            </button>
          </div>

          <div className="max-h-96 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'text-right' : 'text-left'}>
                <div
                  className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-fg'
                      : 'glass-card text-fg'
                  }`}
                >
                  {message.text}
                </div>

                {message.suggestedEventIds?.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.suggestedEventIds.map((eventId) => {
                      const event = eventsById.get(eventId)
                      if (!event) return null
                      return (
                        <Link
                          key={eventId}
                          to={`/events/${eventId}`}
                          onClick={() => setIsOpen(false)}
                          className="block rounded-xl border border-brand-500/20 bg-brand-500/10 px-3 py-2 text-left text-xs text-primary hover:bg-brand-500/20"
                        >
                          <span className="block font-semibold text-fg">{event.eventName}</span>
                          <span className="text-fg-muted">{event.venue}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}

            {chatLoading && (
              <div className="text-left">
                <div className="inline-flex items-center gap-1 rounded-2xl glass-card px-3 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fg/40 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fg/40 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fg/40" />
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submitMessage(prompt)}
                  className="rounded-full border border-line px-3 py-1 text-xs text-fg hover:border-brand-500/40 hover:text-primary"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault()
              submitMessage()
            }}
            className="flex gap-2 border-t border-line p-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask EventMate..."
              className="min-w-0 flex-1 rounded-xl border border-line bg-elevated px-3 py-2 text-sm text-fg placeholder-fg-subtle outline-none focus:border-brand-500/50"
            />
            <button
              type="submit"
              disabled={chatLoading || !input.trim()}
              className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400 hover:scale-105"
        aria-label={isOpen ? 'Close EventMate chatbot' : 'Open EventMate chatbot'}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  )
}
