import { useState } from "react"
import { Star, StarHalf, StarOff } from "lucide-react"


function BookCard({ book, index }) {
  const [expanded, setExpanded] = useState(false)
  const [showInsta, setShowInsta] = useState(false)

  const toggleDescription = () => setExpanded(!expanded)
  const toggleInsta = () => setShowInsta(!showInsta)

  return (
    <li className="bg-white p-4 shadow rounded-xl">
      <h3 className="text-lg font-semibold text-brand-dark">
        {book.title} — <span className="text-gray-700">{book.author}</span>
      </h3>
      <p className="text-sm text-gray-500 mb-1">📅 {book.month} 2025</p>

      {expanded ? (
        <>
          <p className="whitespace-pre-line text-gray-700 my-2">
            {book.description}
          </p>

          {book.instagram && !showInsta && (
            <button
              onClick={toggleInsta}
              className="text-sm text-pink-600 hover:underline mt-2 block"
            >
              Показать Instagram-пост
            </button>
          )}

          {book.instagram && showInsta && (
            <div className="mt-2">
              <iframe
                src={`https://www.instagram.com/p/${book.instagram}/embed`}
                width="100%"
                height="1068"
                className="mx-auto rounded-xl"
                allowtransparency="true"
                allow="encrypted-media"
              ></iframe>
            </div>
          )}

          <button
            onClick={toggleDescription}
            className="text-sm text-gray-600 hover:underline mt-4 block"
          >
            Свернуть
          </button>
        </>
      ) : (
        <button
          onClick={toggleDescription}
          className="text-sm text-pink-600 hover:underline mt-2 block"
        >
          Подробнее
        </button>
      )}

      {book.rating > 0 ? (
        <div className="text-yellow-500 mt-2">
          {"★".repeat(book.rating)}
          {"☆".repeat(5 - book.rating)}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-2 italic">
          Оценка будет после обсуждения
        </p>
      )}
    </li>
  )
}

export default BookCard
