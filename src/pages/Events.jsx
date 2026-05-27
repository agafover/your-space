import { useEffect, useState } from "react"
import EventCard from "../components/EventCard"
import { supabase } from "../lib/supabase"

function formatEventDate(isoDate) {
  if (!isoDate) return ""
  const [y, m, d] = isoDate.split("-")
  return `${d}.${m}.${y}`
}

function Events() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("Все")
  const [accessFilter, setAccessFilter] = useState("Все")
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const { data: eventRows, error: evErr } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false })
      if (cancelled) return
      if (evErr) { setError(evErr.message); setLoading(false); return }

      const eventIds = eventRows.map(e => e.id)
      const { data: imageRows } = eventIds.length
        ? await supabase
            .from("event_images")
            .select("*")
            .in("event_id", eventIds)
            .order("position", { ascending: true })
        : { data: [] }

      const imagesByEventId = new Map()
      for (const img of imageRows ?? []) {
        if (!imagesByEventId.has(img.event_id)) imagesByEventId.set(img.event_id, [])
        imagesByEventId.get(img.event_id).push(img.image_url)
      }

      const adapted = eventRows.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description ?? "",
        date: formatEventDate(e.event_date),
        tags: e.tags ?? [],
        instagram: e.instagram_post_id ?? undefined,
        images: imagesByEventId.get(e.id) ?? (e.cover_url ? [e.cover_url] : []),
      }))
      setEvents(adapted)
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedTag === "Все" || event.tags?.includes(selectedTag)) &&
    (accessFilter === "Все" || event.tags?.includes(accessFilter))
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 dark:bg-night">
      <h1 className="text-3xl font-bold text-brand-dark dark:text-night-text mb-8 text-center">
        Мероприятия
      </h1>

      <p className="text-center text-brand-text dark:text-night-text max-w-2xl mx-auto mb-10">
        Мы любим собираться вместе — будь то книжные обсуждения, поход в оперу, лекции или уютные творческие вечера.
      </p>

      <h2 className="text-xl font-semibold mb-4 text-brand-text dark:text-night-text">
        Прошедшие мероприятия
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-md bg-white dark:bg-night text-brand-text dark:text-night-text"
        >
          <option value="Все">Все направления</option>
          <option value="Мастер-класс">Мастер-класс</option>
          <option value="Культура">Культура</option>
          <option value="Поездки">Поездки</option>
          <option value="Развлечения">Развлечения</option>
          <option value="Образование">Образование</option>
          <option value="Спорт">Спорт</option>
          <option value="Книги">Книги</option>
        </select>

        <select
          value={accessFilter}
          onChange={(e) => setAccessFilter(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-md bg-white dark:bg-night text-brand-text dark:text-night-text"
        >
          <option value="Все">Формат мероприятия</option>
          <option value="Открытое мероприятие">Открытые</option>
          <option value="Закрытое мероприятие">Закрытые</option>
        </select>
      </div>

      {loading ? (
        <div className="py-20 text-center text-brand-text dark:text-night-text">Загрузка мероприятий…</div>
      ) : error ? (
        <div className="py-20 text-center text-red-600">Не удалось загрузить: {error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              expanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Events
