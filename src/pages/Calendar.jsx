import { useEffect, useState } from "react"
import { Calendar as CalendarIcon, Check } from "lucide-react"
import { supabase } from "../lib/supabase"

const RU_MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
]

function formatEventDate(isoDate) {
  if (!isoDate) return ""
  const [y, m, d] = isoDate.split("-")
  return `${Number(d)} ${RU_MONTHS[Number(m) - 1]} ${y}`
}

function Calendar() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [participation, setParticipation] = useState({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_planned", true)
        .order("event_date", { ascending: true })
      if (cancelled) return
      if (!error) setEvents(data ?? [])
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const toggleParticipation = (id) => {
    setParticipation((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-brand-dark dark:text-night-text mb-8 text-left">Афиша мероприятий</h1>

      {loading ? (
        <p className="text-brand-text dark:text-night-text">Загрузка…</p>
      ) : events.length === 0 ? (
        <p className="text-brand-text dark:text-night-muted italic">
          Пока нет запланированных мероприятий. Загляни позже!
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <li
              key={event.id}
              className="bg-white dark:bg-night-surface rounded-xl shadow hover:shadow-xl transform hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col"
            >
              <img
                src={event.cover_url || "/placeholder.jpg"}
                alt={event.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <p className="text-sm text-brand-dark dark:text-night-text mb-1 flex items-center gap-1">
                    <CalendarIcon size={16} />
                    {formatEventDate(event.event_date)}
                  </p>
                  <h3 className="text-lg font-semibold text-brand-text dark:text-night-text mb-2">{event.title}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => toggleParticipation(event.id)}
                  className={`mt-6 px-4 py-2 rounded-xl text-sm transition flex items-center justify-center gap-2
                    ${participation[event.id]
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "border border-brand-dark dark:border-night-border text-brand-dark dark:text-night-text hover:bg-brand-dark hover:text-white dark:hover:bg-rose dark:hover:text-night"
                    }`}
                >
                  {participation[event.id] ? (
                    <>
                      <Check size={16} /> Участвую!
                    </>
                  ) : (
                    "Хочу участвовать"
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Calendar
