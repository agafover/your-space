import EventCard from "../components/EventCard"

const events = [
  {
    title: "Мастер-класс по плетению Рождественских венков",
    date: "29.11.2024",
    description:
      `✨ Уют, вдохновение и волшебство, созданное своими руками ✨
          На нашем рождественском воркшопе мы собрались вместе, чтобы создать праздничные венки — 
          каждый неповторимый, наполненный теплом, фантазией и заботой. 🌲💫

          Было много смеха, общения и искренней радости — в этой атмосфере творчество рождалось легко и с любовью. 💖`,
    instagram: "DDSHA_VNXGK",
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
]

function Events() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-dark mb-8 text-center">
        Мероприятия
      </h1>

      {events.map((event, index) => (
        <EventCard key={index} event={event} index={index} />
      ))}
    </div>
  )
}

export default Events