import { BookOpen, Book, BookPlus, Search, Vote, Trophy, Lightbulb, Speech, ChevronLeft, ChevronRight } from "lucide-react"
import BookCard from "../components/BookCard"
import { useEffect, useState, useRef } from "react"
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
  const computed = ratingsByBookId.get(row.id)
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    description: row.description ?? "",
    image: row.cover_url || "/placeholder.jpg",
    month: formatReadMonth(row.read_month),
    readMonthRaw: row.read_month,
    instagram: row.instagram_post_id ?? undefined,
    genre: row.genre ?? null,
    // Prefer admin-set rating; fall back to computed average from book_votes when available.
    rating: row.rating ?? computed?.avg_rating ?? 0,
    voteCount: computed?.vote_count ?? 0,
  }
}

// Pick top 3 books with rating > 4.5 inside the last 6 months.
// If fewer than 3 match, widen the window (12 → 24 → 60 months → all-time)
// until 3 are found, or return whatever's available.
function selectTopThree(books) {
  const candidates = books
    .filter(b => b.rating != null && b.rating > 4.5)
    .sort((a, b) => b.rating - a.rating)
  if (candidates.length === 0) return []

  const now = Date.now()
  const monthMs = 30 * 24 * 60 * 60 * 1000
  const windows = [6, 12, 24, 60]

  for (const months of windows) {
    const cutoff = now - months * monthMs
    const inWindow = candidates.filter(b => {
      if (!b.readMonthRaw) return false
      return new Date(b.readMonthRaw).getTime() >= cutoff
    })
    if (inWindow.length >= 3) return inWindow.slice(0, 3)
  }
  // Fallback: include books with no read_month too.
  return candidates.slice(0, 3)
}

function Books() {
  const location = useLocation()
  const [expandedId, setExpandedId] = useState(null)
  const [sortBy, setSortBy] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [genreFilter, setGenreFilter] = useState("Все")
  const [currentBook, setCurrentBook] = useState(null)
  const [otherBooks, setOtherBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  function scrollBooks(direction) {
    if (!scrollRef.current) return
    const cardWidth = 288 + 16 // w-72 + gap-4
    scrollRef.current.scrollBy({ left: direction === "left" ? -cardWidth * 2 : cardWidth * 2, behavior: "smooth" })
  }

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

  const allBooks = currentBook ? [currentBook, ...otherBooks] : otherBooks
  const topThree = selectTopThree(allBooks)
  const availableGenres = Array.from(new Set(allBooks.map(b => b.genre).filter(Boolean))).sort()

  const filteredBooks = otherBooks
    .filter(book => {
      const q = searchQuery.toLowerCase()
      const matchesQuery =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        (book.genre?.toLowerCase().includes(q) ?? false)
      const matchesGenre = genreFilter === "Все" || book.genre === genreFilter
      return matchesQuery && matchesGenre
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "author") return a.author.localeCompare(b.author)
      if (sortBy === "genre") return (a.genre ?? "я").localeCompare(b.genre ?? "я")
      return 0
    })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-brand-text dark:text-night-text">
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
      <h1 className="text-3xl font-bold text-brand-dark dark:text-night-text mb-8 text-center flex items-center justify-center gap-2">
        <BookOpen className="w-6 h-6" />
        Книжный клуб
      </h1>

      {currentBook && (
        <section id="current" className="flex flex-col lg:flex-row gap-8 items-start mb-12 bg-white dark:bg-night-surface p-6 rounded-xl shadow">
          {currentBook.image && (
            <img
              src={currentBook.image}
              alt={currentBook.title}
              className="w-full max-w-xs object-contain max-h-96 rounded-lg"
            />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-brand-dark dark:text-night-text mb-1">
              {currentBook.title}
            </h2>
            <p className="text-md text-gray-600 dark:text-night-text mb-2">{currentBook.author}</p>
            {currentBook.genre && (
              <span className="inline-block text-xs px-2 py-0.5 mb-3 rounded-full bg-brand-light/30 dark:bg-night-border text-brand-text dark:text-night-text">
                {currentBook.genre}
              </span>
            )}
            <p className="text-gray-800 dark:text-night-text whitespace-pre-line mb-4">{currentBook.description}</p>
            <a
              href="#"
              className="block w-full sm:inline px-4 py-2 rounded-lg border border-brand-dark dark:border-night-border text-sm hover:bg-brand-dark hover:text-white dark:hover:bg-rose dark:hover:text-night transition text-center break-words"
            >
              Присоединиться к обсуждению
            </a>
          </div>
        </section>
      )}

      {topThree.length > 0 && (
        <section className="max-w-7xl mx-auto pb-12">
          <h2 className="text-2xl font-bold text-brand-dark dark:text-night-text mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Топ-3 от книжного клуба
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {topThree.map((book, i) => (
              <div key={book.id} className="relative">
                <span className="absolute -top-3 -left-3 z-10 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold text-lg flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-night">
                  {i + 1}
                </span>
                <BookCard
                  book={book}
                  expanded={expandedId === `top-${book.id}`}
                  onToggle={() => setExpandedId(expandedId === `top-${book.id}` ? null : `top-${book.id}`)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-brand-dark dark:text-night-text mb-8 text-center">
          Как проходит обсуждение книги?
        </h2>

        <ul className="text-left text-gray-600 dark:text-night-text space-y-4 text-base leading-relaxed">
          <li className="flex items-start gap-3">
            <span className="text-lg text-brand-dark dark:text-night-text"><Book /></span>
            <span>Каждые 3 месяца мы вместе выбираем новую книгу для чтения.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg text-brand-dark dark:text-night-text"><BookPlus /></span>
            <span>Каждая участниица может предложить свою книгу в общий список.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg text-brand-dark dark:text-night-text"><Vote /></span>
            <span>После этого проходит голосование в телеграм-канале (доступ к которому ты получаешь после заполнения анкеты).</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg text-brand-dark dark:text-night-text"><Trophy /></span>
            <span>Топ-3 книги попадают в список на ближайшие 3 месяца.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg text-brand-dark dark:text-night-text"><Speech /></span>
            <span>Обсуждение проходит всегда в конце месяца. Дата и время обсуждения выбираются голосованием телеграм-канале.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg text-brand-dark dark:text-night-text"><Lightbulb /></span>
            <span>Мы всегда рады твоим идеям и вдохновению!</span>
          </li>
        </ul>

        <div className="text-center">
          <a
            href="https://t.me/Your_Space_1bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 rounded-xl border border-brand-dark dark:border-night-border text-brand-dark dark:text-night-text hover:bg-brand-dark hover:text-white dark:hover:bg-rose dark:hover:text-night transition"
          >
            Предложить книгу
          </a>
        </div>
      </section>

      <h2 className="text-xl font-semibold mb-4 text-brand-text dark:text-night-text">
        Другие книги ({filteredBooks.length})
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск: название, автор или жанр"
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-white dark:bg-night-surface text-brand-text dark:text-night-text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="w-full sm:w-56 px-4 py-2 border rounded-md bg-white dark:bg-night-surface text-brand-text dark:text-night-text"
        >
          <option value="Все">Все жанры</option>
          {availableGenres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-56 px-4 py-2 border rounded-md bg-white dark:bg-night-surface text-brand-text dark:text-night-text"
        >
          <option value="recent">Сначала новые</option>
          <option value="title">По названию А–Я</option>
          <option value="author">По автору А–Я</option>
          <option value="genre">По жанру А–Я</option>
        </select>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "thin" }}
        >
          {filteredBooks.map((book) => (
            <div key={book.id} className="flex-shrink-0 w-64 sm:w-72 snap-start">
              <BookCard
                book={book}
                expanded={expandedId === book.id}
                onToggle={() => setExpandedId(expandedId === book.id ? null : book.id)}
              />
            </div>
          ))}
          {filteredBooks.length === 0 && (
            <p className="text-brand-text/60 dark:text-night-muted italic py-8">Книг не найдено.</p>
          )}
        </div>

        {filteredBooks.length > 4 && (
          <>
            <button
              type="button"
              onClick={() => scrollBooks("left")}
              aria-label="Назад"
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-night-surface shadow hover:shadow-lg border border-brand-dark/20 dark:border-night-border text-brand-dark dark:text-night-text"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollBooks("right")}
              aria-label="Вперёд"
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-night-surface shadow hover:shadow-lg border border-brand-dark/20 dark:border-night-border text-brand-dark dark:text-night-text"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Books
