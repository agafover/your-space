import { Star, Instagram } from "lucide-react"

function BookCard({ book, expanded, onToggle }) {
  return (
    <div
      id={`book-${book.title.replace(/\s+/g, "-")}`}
      className={`bg-cream dark:bg-brand-text rounded-xl shadow transition overflow-hidden ${
        expanded ? "col-span-full p-6 flex flex-col lg:flex-row gap-6" : "flex flex-col h-full"
      }`}
    >
      <img
        src={book.image || "/placeholder.jpg"}
        alt={book.title}
        className={`rounded-lg ${
          expanded ? "w-full max-w-xs object-contain max-h-96" : "w-full h-60 object-contain"
        }`}
      />

      <div className={`flex flex-col ${expanded ? "flex-1" : "p-4 flex-1"}`}>
        <h3 className="text-lg font-semibold text-brand-text dark:text-brand-light mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{book.author}</p>

        {book.rating > 0 ? (
          <div className="flex items-center text-yellow-500 text-sm mb-2">
            {Array.from({ length: 5 }, (_, i) => {
              const whole = Math.floor(book.rating)
              const decimal = book.rating - whole
              let fillColor = "none"

              if (i < whole) {
                fillColor = "#facc15"
              } else if (i === whole) {
                if (decimal >= 0.5) fillColor = "#FDE279"
                else if (decimal > 0.0) fillColor = "#FDEDBD"
              }

              return (
                <Star
                  key={i}
                  size={16}
                  fill={fillColor}
                  stroke="#facc15"
                  strokeWidth={1.5}
                />
              )
            })}
            <span className="ml-1 text-gray-500 dark:text-gray-400">
              ({book.rating.toFixed(1)})
            </span>
          </div>
        ) : (
          <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-2">
            Оценка будет после обсуждения
          </p>
        )}

        <p
          className={`text-sm text-brand-text dark:text-gray-200 ${
            expanded ? "whitespace-pre-line" : "line-clamp-3 mb-2"
          }`}
        >
          {book.description}
        </p>

        <div className="mt-2 space-y-1">
          <button
            onClick={onToggle}
            className="text-sm text-brand-dark hover:underline dark:text-brand-light"
          >
            {expanded ? "Скрыть" : "Подробнее"}
          </button>

          {book.instagram && (
            <a
              href={`https://www.instagram.com/p/${book.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-brand-dark dark:text-brand-light hover:underline"
            >
              Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookCard
