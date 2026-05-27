import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Expand,
} from "lucide-react"
import { useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

function EventCard({ event, expanded, onToggle }) {
    const [lightboxIndex, setLightboxIndex] = useState(-1)
    const [carouselIndex, setCarouselIndex] = useState(0)

    const tagColors = {
        "Мастер-класс": "bg-green-100 text-green-800",
        "Культура": "bg-purple-100 text-purple-800",
        "Поездки": "bg-blue-100 text-blue-700",
        "Развлечения": "bg-yellow-100 text-yellow-700",
        "Образование": "bg-orange-100 text-orange-700",
        "Спорт": "bg-red-100 text-red-700",
        "Книги": "bg-pink-100 text-pink-700",
        "Открытое мероприятие": "bg-green-100 text-green-800",
        "Закрытое мероприятие": "bg-red-100 text-red-800",
    }

    const images = event.images ?? []
    const hasMultiple = images.length > 1
    const currentImage = images[carouselIndex] || images[0] || "/placeholder.jpg"

    function showPrev(e) {
        e?.stopPropagation()
        setCarouselIndex((i) => (i - 1 + images.length) % images.length)
    }
    function showNext(e) {
        e?.stopPropagation()
        setCarouselIndex((i) => (i + 1) % images.length)
    }

    return (
        <div
          className={`bg-white dark:bg-night-surface rounded-xl shadow hover:shadow-xl transform hover:-translate-y-1 transition duration-300 overflow-hidden ${expanded ? "lg:flex gap-6 col-span-full" : ""}`}
        >
          <div className={`relative group ${expanded ? "lg:w-1/2 flex-shrink-0" : "w-full"}`}>
            <img
              src={expanded ? currentImage : (images[0] || "/placeholder.jpg")}
              alt={event.title}
              onClick={expanded ? () => setLightboxIndex(carouselIndex) : undefined}
              className={`w-full object-cover ${expanded ? "h-full max-h-[700px] rounded-l-xl cursor-zoom-in" : "h-64 rounded-t-xl"}`}
              style={{ aspectRatio: expanded ? "4 / 3" : undefined }}
            />

            {expanded && hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Предыдущее фото"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-night/80 hover:bg-white dark:hover:bg-night shadow text-brand-dark dark:text-night-text"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Следующее фото"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-night/80 hover:bg-white dark:hover:bg-night shadow text-brand-dark dark:text-night-text"
                >
                  <ChevronRight size={22} />
                </button>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium pointer-events-none">
                  {carouselIndex + 1} / {images.length}
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(carouselIndex) }}
                  aria-label="Открыть на весь экран"
                  className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                >
                  <Expand size={16} />
                </button>
              </>
            )}
          </div>

          <div className="p-4 flex-1 min-w-0">
            <p className="text-sm text-brand-dark dark:text-night-text mb-1 flex items-center gap-1">
              <CalendarDays size={16} className="stroke-brand-dark dark:stroke-rose" />
              {event.date}
            </p>

            {event.tags && (
              <div className="flex flex-wrap gap-2 mb-2">
                {event.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`text-xs font-medium px-2 py-1 rounded-full ${tagColors[tag] || "bg-gray-100 text-gray-700"}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h3 className="text-lg font-bold text-brand-text dark:text-night-text mb-2 break-words">
              {event.title}
            </h3>

            <p
              className={`text-sm text-gray-600 dark:text-night-text whitespace-pre-line break-words ${expanded ? "mb-3" : "line-clamp-4 mb-2"}`}
            >
              {event.description}
            </p>

            {expanded && event.instagram && (
              <a
                href={`https://www.instagram.com/p/${event.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-rose-600 hover:underline block mb-2"
              >
                Показать Instagram-пост
              </a>
            )}

            <button
              onClick={onToggle}
              className="text-sm text-brand-dark dark:text-night-text hover:underline mt-4"
            >
              {expanded ? "Скрыть" : "Подробнее"}
            </button>

            {expanded && (
              <Lightbox
                open={lightboxIndex >= 0}
                close={() => setLightboxIndex(-1)}
                index={lightboxIndex}
                slides={images.map((img) => ({ src: img }))}
              />
            )}
          </div>
        </div>
      )
}

export default EventCard
