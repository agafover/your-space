import { BookOpen } from "lucide-react"
import BookCard from "../components/BookCard"

function Books() {
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
      description: `Ги де Мопассан (1850-1893) - звезда французской и мировой литературы, классик, автор откровенных повестей, романов и великого множества новелл. 
      Говорят, что писатель больше гордился своими любовными победами, чем литературными творениями. У него было много амурных историй - женщины охотно влюблялись 
      в талантливого повесу. Однако имея по несколько интрижек одновременно, Мопассан черпал в них сюжеты для своих произведений.
        Жорж Дюруа, главный герой романа "Милый друг", - темпераментный жизнелюб, которому плевать на муки совести. 
        Он, подобно зверю, подстерегает добычу - блистательную даму, выгодную женитьбу, продвижение по службе. 
        Мопассан тоже обожал подчеркнуть свое животное начало, "машиной для чувств и наслаждений" называл он себя.`,
      rating: 4,
      instagram: "DFTJd__tRz8",
      image: "/books/friend.jpg",
    },
    {
      title: "Скорбь сатаны",
      author: "Мари Корелли",
      month: "февраль 2025",
      description: "Готический роман с философскими размышлениями о зле, искушении и человеческой душе. Необычный микс драмы и мистики.",
      rating: 4,
      instagram: "DHTlHX_NjrA",
      image: "/books/satana.jpg"
    },
    {
      title: "Над пропастью во ржи",
      author: "Джером Д. Сэлинджер",
      month: "март 2025",
      description: "История подростка, потерянного между взрослением и внутренним одиночеством. Классика контркультуры.",
      rating: 4.1,
      instagram: "DH60qOetyho",
      image: "/books/ryecatcher.jpg"
    },
    {
      title: "Вторая жизнь Уве",
      author: "Фредрик Бакман",
      month: "октябрь 2024",
      description: "Трогательная история о том, как одинокий и угрюмый человек находит смысл жизни и дружбу в неожиданном месте.",
      rating: 4.6,
      instagram: "DCxITcROHLY",
      image: "/books/uve.jpg"
    },
    {
      title: "Человек, который принял свою жену за шляпу",
      author: "Оливер Сакс",
      month: "ноябрь 2024",
      description:
        `Одна из наиболее известных книг британского невролога, популяризатора медицины Оливера Сакса. Книга, вышедшая в 1985 году, является сборником историй людей, 
      страдающих от необычных нарушений психики и борющихся за выживание в условиях, невообразимых для здоровых людей.`,
      rating: 3.5,
      instagram: "DCxUPsAtb7u",
      image: "/books/oliver.jpg",
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-8 text-center flex items-center justify-center gap-2">
        <BookOpen className="w-6 h-6" />
        Книжный клуб
      </h1>

      {/* Current book */}
      <section className="flex flex-col lg:flex-row gap-8 items-start mb-12 bg-white dark:bg-brand-dark p-6 rounded-xl shadow">
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
            className="px-4 py-2 rounded-lg border border-brand-dark dark:border-brand-light text-sm hover:bg-brand-dark hover:text-white dark:hover:bg-brand-light dark:hover:text-brand-dark transition"
          >
            Присоединиться к обсуждению
          </a>
        </div>
      </section>

      {/* Other books */}
      <h2 className="text-xl font-semibold mb-4 text-brand-dark dark:text-brand-light">Другие книги</h2>
      <div className="flex flex-wrap gap-6">
        {otherBooks.map((book, index) => (
          <div key={index} className="w-full sm:w-[48%] md:w-[30%] lg:w-[18%]">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Books