import { BookOpen, Search } from "lucide-react"
import BookCard from "../components/BookCard"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

function Books() {
  const location = useLocation()
  const [expandedId, setExpandedId] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash)
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [location])

  const currentBook = {
    title: "Охота на маленькую щуку",
    author: "Юхани Карила",
    month: "апрель 2025",
    description: `«Охота на маленькую щуку» — одновременно трогательная история любви и затейливое фэнтези. Роман-погружение в самобытный фольклор Лапландии и современную финскую жизнь. Это роман-притча, роман-сказка про большую любовь, случайное предательство, преодоление и прощение себя.
      Насыщенный точными описаниями северной природы, роман переносит читателя в какой-то доисторический мир, где миф не отличим от реальности, а человек и природа являются единым целым.
      
      🏆 Премия молодых писателей Финляндии (Kalevi Jantti Prize)
      🏆 Лучшая книга в жанре фэнтези в Финляндии (Tahtifantasia Prize)
      🌍 Роман переведен на 12 языков`,
    rating: 0,
    image: "/books/oxota.jpg",
  }

  const otherBooks = [
    {
      title: "Милый друг",
      author: "Ги де Мопассан",
      month: "январь 2025",
      description: `«Милый друг» – роман французского писателя Ги де Мопассана, написанный в 1885 году, рассказывает об авантюристе, который мечтает сделать блестящую карьеру. У него нет каких-либо талантов, разве что своей внешностью он может покорить сердце любой дамы, а совесть прощает ему любую подлость. И… этого хватает для того, чтобы стать сильным мира сего.`,
      rating: 4,
      instagram: "DFTJd__tRz8",
      image: "/books/friend.jpg",
    },
    {
      title: "Скорбь сатаны",
      author: "Мари Корелли",
      month: "февраль 2025",
      description: `Молодой писатель Джеффри Темпест, прозябающий в нищете и безвестности, продает душу Сатане и получает от Князя Тьмы все, о чем только мечтал… точнее, почти все.
Теперь светское общество, ранее им пренебрегавшее, лежит у его ног. К его услугам несметное состояние, любовь прекрасной девушки, роскошь и удовольствия.
Но много ли это значит, если утрачено главное, ради чего Джеффри жил, - его талант?.....`,
      rating: 4,
      instagram: "DHTlHX_NjrA",
      image: "/books/satana.jpg"
    },
    {
      title: "Над пропастью во ржи",
      author: "Джером Д. Сэлинджер",
      month: "март 2025",
      description: `Писатель-классик, писатель-загадка, на пике своей карьеры объявивший об уходе из литературы и поселившийся в глухой американской провинции вдали от мирских соблазнов. Он ушел от нас совсем недавно - в 2010 году…
Единственный роман Сэлинджера - "Над пропастью во ржи" - стал переломной вехой в истории мировой литературы. Название книги и имя главного героя Холдена Колфилда сделались кодовыми для многих поколений молодых бунтарей от битников и хиппи до представителей современных радикальных молодежных движений.`,
      rating: 4.1,
      instagram: "DH60qOetyho",
      image: "/books/ryecatcher.jpg"
    },
    {
      title: "Вторая жизнь Уве",
      author: "Фредрик Бакман",
      month: "октябрь 2024",
      description: `На первый взгляд Уве – самый угрюмый человек на свете. Он, как и многие из нас, полагает, что его окружают преимущественно идиоты – соседи, которые неправильно паркуют свои машины; продавцы в магазине, говорящие на птичьем языке; бюрократы, портящие жизнь нормальным людям…

Но у угрюмого ворчливого педанта – большое доброе сердце. И когда молодая семья новых соседей случайно повреждает его почтовый ящик, это становится началом невероятно трогательной истории об утраченной любви, неожиданной дружбе, бездомных котах и древнем искусстве сдавать назад на автомобиле с прицепом. Истории о том, как сильно жизнь одного человека может повлиять на жизни многих других.`,
      rating: 4.6,
      instagram: "DCxITcROHLY",
      image: "/books/uve.jpg"
    },
    {
      title: "Человек, который принял свою жену за шляпу",
      author: "Оливер Сакс",
      month: "ноябрь 2024",
      description: "...",
      rating: 3.5,
      instagram: "DCxUPsAtb7u",
      image: "/books/oliver.jpg",
    }
  ]

  const filteredBooks = otherBooks
    .filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "author") return a.author.localeCompare(b.author)
      return 0 // default (most recent is natural order here)
    })

  const visibleBooks = showAll ? filteredBooks : filteredBooks.slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-8 text-center flex items-center justify-center gap-2">
        <BookOpen className="w-6 h-6" />
        Книжный клуб
      </h1>

      {/* Current book */}
      <section id="current" className="flex flex-col lg:flex-row gap-8 items-start mb-12 bg-cream dark:bg-brand-text p-6 rounded-xl shadow">
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

      {/* Other books */}
      <h2 className="text-xl font-semibold mb-4 text-brand-text dark:text-brand-light flex justify-between items-center">
        <span>Другие книги</span>
        {filteredBooks.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-brand-dark dark:text-brand-light hover:underline"
          >
            {showAll ? "Скрыть" : "Показать все"}
          </button>
        )}
      </h2>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        {/* Поиск с иконкой */}
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

        {/* Сортировка */}
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
        {visibleBooks.map((book, index) => (
          <BookCard
            key={index}
            book={book}
            expanded={expandedId === index}
            onToggle={() => setExpandedId(expandedId === index ? null : index)}
          />
        ))}
      </div>
    </div>
  )

}

export default Books