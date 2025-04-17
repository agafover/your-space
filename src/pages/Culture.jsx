import EventCard from "../components/CultureCard"

const cultureEvents = [
  {
    title: "Мадам Баттерфляй",
    date: "13.12.2024",
    description:
      "Поход в Государственную оперу на оперу Джакомо Пуччини \"Мадам Баттерфляй\". Великолепные декорации, яркие костюмы и трогательная история любви сделали этот вечер незабываемым.",
    instagram: "DD5EwaqO7Tc",
    images: [
      "/images/opera-1.jpg",
      "/images/opera-2.jpg",
      "/images/opera-3.jpg",
      "/images/opera-4.jpg",
      "/images/opera-5.jpg",
      "/images/opera-6.jpg",
      // "/images/opera-7.HEIC",
    ],
  },
]

function Culture() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-dark mb-8 text-center">
        Культура
      </h1>

      {cultureEvents.map((event, index) => (
        <EventCard key={index} event={event} index={index} />
      ))}
    </div>
  )
}

export default Culture
