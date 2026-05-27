import { useEffect, useState } from "react"
import { BookOpen, CalendarDays, Users, Calendar as CalendarIcon } from "lucide-react"
import { Link } from "react-router-dom"
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

function Home() {
  const [currentBook, setCurrentBook] = useState(null)
  const [upcomingEvents, setUpcomingEvents] = useState([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const today = new Date().toISOString().slice(0, 10)
      const [bookRes, eventsRes] = await Promise.all([
        supabase.from("books").select("*").eq("is_current", true).maybeSingle(),
        supabase.from("events").select("*").gte("event_date", today).order("event_date", { ascending: true }).limit(3),
      ])
      if (cancelled) return
      if (!bookRes.error) setCurrentBook(bookRes.data)
      if (!eventsRes.error) setUpcomingEvents(eventsRes.data ?? [])
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="relative text-center py-10 overflow-hidden">
      <div className="absolute inset-0 flex justify-center items-start z-[-1]">
        <div className="w-[800px] h-[800px] rounded-full bg-brand-dark opacity-10 mt-[-100px]" />
      </div>

      <section className="flex flex-col md:flex-row items-center justify-between gap-10 max-w-7xl mx-auto px-4 pb-16">
        <div className="text-left md:w-1/2">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            <span className="text-brand-text dark:text-night-text">Добро пожаловать в</span>{" "}
            <span className="text-brand-dark dark:text-night-text">Your Space</span>
          </h1>
          <p className="italic text-lg text-brand-dark dark:text-night-text mb-4">
            We are many voices, one space
          </p>
          <p className="text-xl text-brand-text dark:text-night-text mb-6">
            Женское сообщество в Праге — твоё пространство для самовыражения, поддержки и роста.
            Мы читаем, встречаемся, обсуждаем и вдохновляем друг друга.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/books"
              className="bg-brand-dark dark:bg-night-surface text-white px-5 py-2 rounded-lg hover:bg-brand-light hover:text-brand-dark transition"
            >
              Книжный клуб
            </Link>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScu1AP1n_iihe5KNLnAvnqLKSYN6-T72syL-cTzJ2f9lF0FyQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-brand-dark dark:border-white text-brand-dark dark:text-night-text px-5 py-2 rounded-lg transition hover:bg-brand-dark hover:text-white dark:hover:bg-rose dark:hover:bg-night-surface"
            >
              Хочешь к нам в сообщество? Заполни анкету!
            </a>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-end pr-4">
          <img
            src="yourspace.jpg"
            alt="Книги и сообщество"
            className="w-80 aspect-square mx-auto md:mx-0 rounded-full shadow object-cover"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center max-w-7xl mx-auto px-4 pb-16">
        <Link to="/books" className="block p-6 bg-white dark:bg-night-surface rounded-xl shadow hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
          <BookOpen className="mx-auto text-brand-dark dark:text-night-text mb-3" size={32} />
          <h3 className="text-lg font-semibold text-brand-text dark:text-night-text mb-2">Книжный клуб</h3>
          <p className="text-sm text-gray-600 dark:text-night-text">Обсуждаем вдохновляющие книги в уютной атмосфере.</p>
        </Link>

        <Link to="/events" className="block p-6 bg-white dark:bg-night-surface rounded-xl shadow shadow hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
          <CalendarDays className="mx-auto text-brand-dark dark:text-night-text mb-3" size={32} />
          <h3 className="text-lg font-semibold text-brand-text dark:text-night-text mb-2">Мероприятия</h3>
          <p className="text-sm text-gray-600 dark:text-night-text">Встречи, лекции и творческие вечера в Праге и онлайн.</p>
        </Link>

        <Link to="/about" className="block p-6 bg-white dark:bg-night-surface rounded-xl shadow shadow hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
          <Users className="mx-auto text-brand-dark dark:text-night-text mb-3" size={32} />
          <h3 className="text-lg font-semibold text-brand-text dark:text-night-text mb-2">Комьюнити</h3>
          <p className="text-sm text-gray-600 dark:text-night-text">Делимся опытом и поддержкой с женщинами из разных сфер.</p>
        </Link>
      </section>

      {currentBook && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <Link to="/books">
            <h2 className="text-2xl font-bold text-left mb-6 text-brand-text dark:text-night-text">В этом месяце мы читаем</h2>
            <div className="bg-white dark:bg-night-surface shadow hover:shadow-xl transform hover:-translate-y-1 transition duration-300 rounded-xl p-6 flex flex-col md:flex-row gap-6">
              <img src={currentBook.cover_url} alt={currentBook.title} className="w-full md:w-64 h-auto rounded-lg object-cover" />
              <div className="text-left md:text-center md:flex-1 md:flex md:flex-col md:justify-center">
                <h3 className="text-xl font-bold text-brand-dark dark:text-night-text mb-1">{currentBook.title}</h3>
                <p className="text-sm text-gray-600 dark:text-night-text mb-2">{currentBook.author}</p>
                <p className="text-gray-800 dark:text-night-text whitespace-pre-line mb-2">{currentBook.description}</p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {upcomingEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-left text-brand-text dark:text-night-text">Ближайшие мероприятия</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <li key={event.id} className="bg-white dark:bg-night-surface rounded-xl shadow hover:shadow-xl transform hover:-translate-y-1 transition duration-300 overflow-hidden whitespace-pre-line">
                <img
                  src={event.cover_url || "/placeholder.jpg"}
                  alt={event.title}
                  className="w-full h-56 object-cover"
                />
                <Link to="/calendar">
                  <div className="p-6">
                    <p className="text-sm text-brand-dark dark:text-night-text mb-1 flex items-center gap-1">
                      <CalendarIcon size={16} />
                      {formatEventDate(event.event_date)}
                    </p>
                    <h3 className="text-lg font-semibold text-brand-text dark:text-night-text mb-2">{event.title}</h3>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default Home
