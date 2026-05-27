import { BookOpen, Book, BookPlus, Search, Vote, Trophy, Lightbulb, Speech, ChevronRight } from "lucide-react"
import BookCard from "../components/BookCard"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { supabase } from "../lib/supabase"

const RU_MONTHS = [
  "январь", "февраль", "март", "апрель", "май", "июнь",
  "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",
]

function formatReadMonth(isoDate) {
  if (!isoDate) return ""
  const [y, m] = isoDate.split("-")
  return `${RU_MONTHS[Number(m) - 1]} ${y}`
}

function adaptBook(row, ratingsByBookId) {
  const rating = ratingsByBookId.get(row.id)
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    description: row.description ?? "",
    image: row.cover_url || "/placeholder.jpg",
    month: formatReadMonth(row.read_month),
    instagram: row.instagram_post_id ?? undefined,
    rating: rating?.avg_rating ?? 0,
    voteCount: rating?.vote_count ?? 0,
  }
}

function Books() {
  const location = useLocation()
  const [expandedId, setExpandedId] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentBook, setCurrentBook] = useState(null)
  const [otherBooks, setOtherBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const [booksRes, ratingsRes] = await Promise.all([
        supabase.from("books").select("*").order("read_month", { ascending: false }),
        supabase.rpc("get_book_ratings"),
      ])
      if (cancelled) return
      if (booksRes.error) {
        setError(booksRes.error.message)
        setLoading(false)
        return
      }
      const ratingsByBookId = new Map()
      if (!ratingsRes.error && ratingsRes.data) {
        for (const r of ratingsRes.data) ratingsByBookId.set(r.book_id, r)
      }
      const adapted = booksRes.data.map(b => adaptBook(b, ratingsByBookId))
      setCurrentBook(adapted.find(b => booksRes.data.find(r => r.id === b.id)?.is_current) ?? null)
      setOtherBooks(adapted.filter(b => !booksRes.data.find(r => r.id === b.id)?.is_current))
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash)
      if (target) target.scrollIntoView({ behavior: "smooth" })
    }
  }, [location])

  const filteredBooks = otherBooks
    .filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "author") return a.author.localeCompare(b.author)
      return 0
    })

  const visibleBooks = showAll ? filteredBooks : filteredBooks.slice(0, 4)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-brand-text dark:text-brand-light">
        Загрузка книг…
      </div>
    )
  }
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-600">
        Не удалось загрузить книги: {error}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-8 text-center flex items-center justify-center gap-2">
        <BookOpen className="w-6 h-6" />
        Книжный клуб
      </h1>

      {currentBook && (
        <section id="current" className="flex flex-col lg:flex-row gap-8 items-start mb-12 bg-white dark:bg-brand-text p-6 rounded-xl shadow">
          {currentBook.image && (
            <img
              src={currentBook.image}
              alt={currentBook.title}
              className="w-full max-w-xs object-contain max-h-96 rounded-lg"
            />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-brand-dark dark:text-brand-light mb-1">
              {currentBook.title}
            </h2>
            <p className="text-md text-gray-600 dark:text-gray-300 mb-2">{currentBook.author}</p>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line mb-4">{currentBook.description}</p>
            <a
              href="#"
              className="block w-full sm:inline px-4 py-2 rounded-lg border border-brand-dark dark:border-brand-light text-sm hover:bg-brand-dark hover:text-white dark:hover:bg-brand-light dark:hover:text-brand-dark transition text-center break-words"
            >
              Присоединиться к обсуждению
            </a>
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-brand-dark dark:text-brand-light mb-8 text-center">
          Как проходит обсуждение книги?
        </h2>

        <ul className="text-left text-gray-600 dark:text-gray-300 space-y-4 text-base leading-relaxed">
          <li className="flex items-start gap-3">
            <span className="text-lg text-brand-dark dark:text-brand-light"><Book /></span>
            <span>Каждые 3 месяца мы вместе выбираем новую книгу для чтения.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg text-brand-dark dark:text-brand-light"><BookPlus /></span>
            <span>Каждая участниица может предложить свою книгу в общий список.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg text-brand-dark dark:text-brand-light"><Vote /></span>
            <span>После этого проходит голосование в телеграм-канале (доступ к которому ты получаешь после заполнения анкеты).</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg text-brand-dark dark:text-brand-light"><Trophy /></span>
            <span>Топ-3 книги попадают в список на ближайшие 3 месяца.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg text-brand-dark dark:text-brand-light"><Speech /></span>
            <span>Обсуждение проходит всегда в конце месяца. Дата и время обсуждения выбираются голосованием телеграм-канале.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg text-brand-dark dark:text-brand-light"><Lightbulb /></span>
            <span>Мы всегда рады твоим идеям и вдохновению!</span>
          </li>
        </ul>

        <div className="text-center">
          <a
            href="https://t.me/Your_Space_1bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 rounded-xl border border-brand-dark dark:border-brand-light text-brand-dark dark:text-brand-light hover:bg-brand-dark hover:text-white dark:hover:bg-brand-light dark:hover:text-brand-dark transition"
          >
            Предложить книгу
          </a>
        </div>
      </section>

      <h2 className="text-xl font-semibold mb-4 text-brand-text dark:text-brand-light flex justify-between items-center">
        <span>Другие книги</span>
        {filteredBooks.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-brand-dark dark:text-brand-light hover:underline flex items-center gap-1"
          >
            {showAll ? "Скрыть" : "Показать все"}
            <ChevronRight size={16} />
          </button>
        )}
      </h2>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по названию или автору"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-1/4 px-4 py-2 border rounded-md"
        >
          <option value="recent">Сначала новые</option>
          <option value="title">По названию A–Я</option>
          <option value="author">По автору A–Я</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            expanded={expandedId === book.id}
            onToggle={() => setExpandedId(expandedId === book.id ? null : book.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default Books
