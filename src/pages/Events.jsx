import { useState } from "react"
import { Search } from "lucide-react"
import EventCard from "../components/EventCard"

const events = [
  {
    title: "Мастер-класс по плетению Рождественских венков",
    date: "29.11.2024",
    description:
      `✨ Уют, вдохновение и волшебство, созданное своими руками ✨\nНа нашем рождественском воркшопе мы собрались вместе, чтобы создать праздничные венки — каждый неповторимый, наполненный теплом, фантазией и заботой. 🌲💫\n\nБыло много смеха, общения и искренней радости — в этой атмосфере творчество рождалось легко и с любовью. 💖`,
    instagram: "DDSHA_VNXGK",
    tags: ["Мастер-класс"],
    images: [
      "/images/wreath-1.jpg",
      "/images/wreath-2.jpg",
      "/images/wreath-3.jpg",
      "/images/wreath-4.jpg",
      "/images/wreath-5.jpg",
      "/images/wreath-6.jpg",
      "/images/wreath-7.jpg",
      "/images/wreath-9.jpg",
      "/images/wreath-8.jpg",
    ],
  },
  {
    title: "Мадам Баттерфляй",
    date: "13.12.2024",
    description:
      "Поход в Государственную оперу на оперу Джакомо Пуччини \"Мадам Баттерфляй\". Великолепные декорации, яркие костюмы и трогательная история любви сделали этот вечер незабываемым.",
    instagram: "DD5EwaqO7Tc",
    tags: ["Культура"],
    images: [
      "/images/opera-1.jpg",
      "/images/opera-2.jpg",
      "/images/opera-3.jpg",
      "/images/opera-4.jpg",
      "/images/opera-5.jpg",
      "/images/opera-6.jpg",
    ],
  },
]



function Events() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("Все")
  const [expandedIndex, setExpandedIndex] = useState(null)

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedTag === "Все" || event.tags?.includes(selectedTag))
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-8 text-center">
        Мероприятия
      </h1>
      <p className="text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10">
        Мы любим собираться вместе — будь то книжные обсуждения, поход в оперу, лекции или уютные творческие вечера.
      </p>

      <h2 className="text-xl font-semibold mb-4 text-brand-dark dark:text-brand-light">
        Прошедшие мероприятия
      </h2>

      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по названию"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 border rounded-md"
        >
          <option value="Все"> Все</option>
          <option value="Мастер-класс">Мастер-класс</option>
          <option value="Культура">Культура</option>
          <option value="Поездки">Поездки</option>
          <option value="Развлечения">Развлечения</option>
        </select>
      </div>

      {/* Карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredEvents.map((event, index) => (
          <EventCard
            key={index}
            event={event}
            expanded={expandedIndex === index}
            onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  )
}


export default Events
