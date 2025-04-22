import { useState } from "react"
import { Calendar as CalendarIcon, Clock3, MapPin, Check } from "lucide-react"

const calendarEvents = [

  {
    date: "24 апреля 2025",
    time: "19:00",
    title: "Караоке квиз",
    format: "Офлайн в квиз-плиз",
  },
  {
    date: "26 апреля 2025",
    time: "16:00",
    title: "Читательская встреча: «Охота на маленькую щуку»",
    format: "Офлайн в кафе Dobrá čajovna",
  },
]

function Calendar() {
  const [participation, setParticipation] = useState({})

  const toggleParticipation = (index) => {
    setParticipation((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-dark mb-6 text-center">
        Афиша мероприятий
      </h1>

      <ul className="space-y-6">
        {calendarEvents.map((event, index) => (
          <li key={index} className="bg-white dark:bg-brand-text p-6 rounded-xl shadow">
            <p className="text-sm text-brand-dark dark:text-brand-light  mb-1 flex items-center gap-1">
              <CalendarIcon size={16} className="stroke-brand-drak dark:stroke-brand-light" />
              {event.date}
            </p>

            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Clock3 size={16} className="stroke-gray-600" />
              {event.time}
            </p>

            <h3 className="text-lg font-bold text-brand-dark">{event.title}</h3>

            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <MapPin size={16} className="stroke-gray-600" />
              {event.format}
            </p>

            <button
              type="button"
              onClick={() => toggleParticipation(index)}
              className={`mt-4 px-4 py-2 rounded-xl text-sm transition flex items-center justify-center gap-2
    ${participation[index]
                  ? "bg-green-500 text-white dark:bg-green-600 dark:text-gray-800"
                  : "border border-brand-dark dark:border-brand-light text-brand-dark dark:text-brand-light hover:bg-brand-dark hover:text-white dark:hover:bg-brand-light dark:hover:text-brand-dark"}
  `}
            >
              {participation[index] ? (
                <>
                  <Check size={16} /> Участвую!
                </>
              ) : (
                "Хочу участвовать"
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Calendar
