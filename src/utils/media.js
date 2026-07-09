// Deterministic hue from a string so each event gets a stable, distinct tint.
const hueFromString = (str = '') => {
  let h = 0
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) % 360
  return h
}

// A nice branded gradient placeholder (SVG data URI) with the event's initial —
// used when an event has no cover image, instead of an ugly "No Image" box.
export const eventPlaceholder = (event) => {
  const name = event?.eventName || 'Event'
  const letter = name.trim().charAt(0).toUpperCase() || 'V'
  const h = hueFromString(name)
  const c1 = `hsl(${h}, 65%, 58%)`
  const c2 = `hsl(${(h + 45) % 360}, 60%, 42%)`
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1000'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>
      </linearGradient>
    </defs>
    <rect width='800' height='1000' fill='url(%23g)'/>
    <circle cx='400' cy='470' r='150' fill='rgba(255,255,255,0.14)'/>
    <text x='400' y='470' font-family='Sora, Arial, sans-serif' font-size='190' font-weight='700'
      fill='rgba(255,255,255,0.92)' text-anchor='middle' dominant-baseline='central'>${letter}</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// Resolve an event's image URL against the API base (handles absolute URLs,
// blob previews, and server-relative upload paths). Falls back to a styled
// placeholder when there's no image.
export const resolveEventImage = (event) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') || ''
  const img = event?.imageUrl
  if (!img) return eventPlaceholder(event)
  if (img.startsWith('http') || img.startsWith('blob')) return img
  return `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`
}

// Emoji + gradient accent per category, matched by name.
const CATEGORY_META = {
  Music: { icon: '🎵', grad: 'from-pink-500/20 to-fuchsia-500/10' },
  Tech: { icon: '💻', grad: 'from-sky-500/20 to-blue-500/10' },
  Art: { icon: '🎨', grad: 'from-amber-500/20 to-yellow-500/10' },
  Comedy: { icon: '🎤', grad: 'from-emerald-500/20 to-green-500/10' },
  Sports: { icon: '⚡', grad: 'from-indigo-500/20 to-violet-500/10' },
  Food: { icon: '🍽️', grad: 'from-orange-500/20 to-amber-500/10' },
  Theater: { icon: '🎭', grad: 'from-rose-500/20 to-pink-500/10' },
  Workshop: { icon: '🛠️', grad: 'from-teal-500/20 to-cyan-500/10' },
}

export const categoryMeta = (name = '') => {
  const key = Object.keys(CATEGORY_META).find((k) => name.toLowerCase().includes(k.toLowerCase()))
  return key ? CATEGORY_META[key] : { icon: '🎟️', grad: 'from-primary/20 to-primary/5' }
}
