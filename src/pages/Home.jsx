import { Instagram, BookOpen, CalendarDays, Users, Calendar, Clock3, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import BookCard from "../components/BookCard"

const currentBook = {
  title: "Охота на маленькую щуку",
  author: "Юхани Карила",
  rating: 0,
  image: "/books/oxota.jpg",
  description: "«Охота на маленькую щуку» — одновременно трогательная история любви и затейливое фэнтези. Роман-погружение в самобытный фольклор Лапландии и современную финскую жизнь. Это роман-притча, роман-сказка про большую любовь, случайное предательство, преодоление и прощение себя."
}

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

function Home() {
  return (
    <div className="relative text-center py-10 overflow-hidden">
      <div className="absolute inset-0 flex justify-center items-start z-[-1]">
        <div className="w-[800px] h-[800px] rounded-full bg-brand-dark opacity-10 mt-[-100px]" />
      </div>

      <section className="flex flex-col md:flex-row items-center justify-between gap-10 max-w-7xl mx-auto px-4 pb-16">
        <div className="text-left md:w-1/2">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            <span className="text-brand-text dark:text-brand-light">Добро пожаловать в</span>{" "}
            <span className="text-brand-dark dark:text-brand">Your Space</span>
          </h1>
          <p className="italic text-lg text-brand-dark dark:text-brand-light mb-4">
            We are many voices, one space
          </p>
          <p className="text-xl text-brand-text dark:text-brand-circle mb-6">
            Женское сообщество в Праге — твоё пространство для самовыражения, поддержки и роста.
            Мы читаем, встречаемся, обсуждаем и вдохновляем друг друга.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/books"
              className="bg-brand-dark text-white px-5 py-2 rounded-lg hover:bg-brand-light hover:text-brand-dark transition"
            >
              Книжный клуб
            </Link>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScu1AP1n_iihe5KNLnAvnqLKSYN6-T72syL-cTzJ2f9lF0FyQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-brand-dark dark:border-brand-light text-brand-dark dark:text-brand-light px-5 py-2 rounded-lg transition hover:bg-brand-dark hover:text-white dark:hover:bg-brand-light dark:hover:text-brand-dark"
            >
              Хочешь к нам в сообщество? Заполни анкету!
            </a>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-end pr-4">
          <img
            src="yourspace.jpg"
            alt="Книги и сообщество"
            className="w-80 h-80 mx-auto md:mx-0 rounded-full shadow object-cover"
          />
        </div>

      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center max-w-7xl mx-auto px-4 pb-16">
        <Link to="/books" className="block p-6 bg-white dark:bg-brand-text rounded-xl shadow hover:shadow-md transition">
          <BookOpen className="mx-auto text-brand-dark dark:text-brand mb-3" size={32} />
          <h3 className="text-lg font-semibold text-brand-text dark:text-brand-light mb-2">Книжный клуб</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Обсуждаем вдохновляющие книги в уютной атмосфере.</p>
        </Link>

        <Link to="/events" className="block p-6 bg-white dark:bg-brand-text rounded-xl shadow hover:shadow-md transition">
          <CalendarDays className="mx-auto text-brand-dark dark:text-brand mb-3" size={32} />
          <h3 className="text-lg font-semibold text-brand-text dark:text-brand-light mb-2">Мероприятия</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Встречи, лекции и творческие вечера в Праге и онлайн.</p>
        </Link>

        <Link to="/about" className="block p-6 bg-white dark:bg-brand-text rounded-xl shadow hover:shadow-md transition">
          <Users className="mx-auto text-brand-dark dark:text-brand mb-3" size={32} />
          <h3 className="text-lg font-semibold text-brand-text dark:text-brand-light mb-2">Комьюнити</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Делимся опытом и поддержкой с женщинами из разных сфер.</p>
        </Link>
      </section>


      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-left mb-6 text-brand-text dark:text-brand-light">В этом месяце мы читаем</h2>
        <div className="bg-white dark:bg-brand-text shadow rounded-xl p-6 flex flex-col md:flex-row gap-6">
          <img src={currentBook.image} alt={currentBook.title} className="w-full md:w-64 h-auto rounded-lg object-cover" />
          <div className="text-left md:text-center md:flex-1 md:flex md:flex-col md:justify-center">
            <h3 className="text-xl font-bold text-brand-dark dark:text-brand-light mb-1">{currentBook.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{currentBook.author}</p>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line mb-2">{currentBook.description}</p>
            <Link to="/books#current" className="text-sm mt-2 inline-block text-brand-dark dark:text-brand-light hover:underline">Подробнее</Link>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-left text-brand-text dark:text-brand-light">Ближайшие мероприятия</h2>
          <Link to="/calendar" className="text-brand-dark dark:text-brand-light text-sm hover:underline">Посмотреть все →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {calendarEvents.map((event, index) => (
            <div key={index} className="bg-white dark:bg-brand-text rounded-xl shadow p-6 text-left">
              <p className="text-sm text-brand-dark dark:text-brand-light mb-1 flex items-center gap-1"><Calendar size={16} /> {event.date}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1"><Clock3 size={16} />{event.time}</p>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">{event.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1"><MapPin size={16} /> {event.format}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
