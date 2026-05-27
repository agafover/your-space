import { Star, Instagram } from "lucide-react"
import { sanitizeInstagramPostId } from "./InstagramEmbed"

function BookCard({ book, expanded, onToggle }) {
  return (
    <div
      id={`book-${book.title.replace(/\s+/g, "-")}`}
      className="bg-white dark:bg-night-surface rounded-xl shadow hover:shadow-xl transform hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col h-full"
    >
      <img
        src={book.image || "/placeholder.jpg"}
        alt={book.title}
        className="w-full h-60 object-contain rounded-lg"
      />

      <div className="flex flex-col p-4 flex-1">
        <h3 className="text-lg font-semibold text-brand-text dark:text-night-text mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-night-text mb-1">{book.author}</p>
        {book.genre && (
          <span className="self-start inline-block text-xs px-2 py-0.5 mb-2 rounded-full bg-brand-light/30 dark:bg-night-border text-brand-text dark:text-night-text">
            {book.genre}
          </span>
        )}

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
            <span className="ml-1 text-gray-500 dark:text-night-muted">
              ({book.rating.toFixed(1)})
            </span>
          </div>
        ) : (
          <p className="text-sm italic text-gray-500 dark:text-night-muted mb-2">
            Оценка будет после обсуждения
          </p>
        )}

        <p
          className={`text-sm text-gray-800 dark:text-night-text mb-2 ${
            expanded ? "whitespace-pre-line" : "line-clamp-3"
          }`}
        >
          {book.description}
        </p>

        <div className="mt-2 space-y-1">
          <button
            onClick={onToggle}
            className="text-sm text-brand-dark hover:underline dark:text-night-text"
          >
            {expanded ? "Скрыть" : "Подробнее"}
          </button>

          {book.instagram && (
            <a
              href={`https://www.instagram.com/p/${sanitizeInstagramPostId(book.instagram)}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-brand-dark dark:text-night-text hover:underline"
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
