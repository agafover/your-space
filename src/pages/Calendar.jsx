import { useState } from "react"

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
          <li key={index} className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-rose-600 mb-1">📅 {event.date}</p>
            <p className="text-sm text-gray-600 mb-1">🕒 {event.time}</p>
            <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
            <p className="text-sm text-gray-600 mt-1">📍 {event.format}</p>

            <button
              onClick={() => toggleParticipation(index)}
              className={`mt-4 px-4 py-2 rounded-xl text-sm transition ${participation[index]
                  ? "bg-green-500 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
            >
              {participation[index] ? "✅ Участвую" : "Хочу участвовать"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Calendar
