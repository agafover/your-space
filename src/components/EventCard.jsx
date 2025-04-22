import { CalendarDays, Instagram } from "lucide-react"
import { useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

function ImageGallery({ images, onClickImage }) {
    const scrollRef = useRef(null)

    const scroll = (direction) => {
        if (scrollRef.current) {
            const container = scrollRef.current
            container.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" })
        }
    }

    return (
        <div className="relative mt-3">
            {/* Галерея */}
            <div ref={scrollRef} className="flex gap-2 overflow-x-auto no-scrollbar">
                {images.slice(1).map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        alt="mini"
                        onClick={() => onClickImage(i + 1)}
                        className="h-24 w-24 object-cover rounded-md flex-shrink-0 cursor-pointer hover:opacity-90"
                    />
                ))}
            </div>

            {/* Стрелки */}
            {images.length > 10 && (
                <>
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100"
                    >
                        <ChevronRight size={20} />
                    </button>
                </>
            )}
        </div>
    )
}


function EventCard({ event, expanded, onToggle }) {
    const [lightboxIndex, setLightboxIndex] = useState(-1)
    const tagColors = {
        "Мастер-класс": "bg-green-100 text-green-800",
        "Культура": "bg-purple-100 text-purple-800",
        "Поездки": "bg-blue-100 text-blue-700",
        "Развлечения": "bg-yellow-100 text-yellow-700",
        "Образование": "bg-orange-100 text-orange-700",
        "Спорт": "bg-red-100 text-red-700",
        "Книги": "bg-pink-100 text-pink-700",
    }


    return (
        <div
            className={`bg-white dark:bg-brand-dark rounded-xl shadow transition overflow-hidden ${expanded ? "lg:flex gap-6 col-span-2" : ""
                }`}
        >
            <div className={`w-full ${expanded ? "lg:w-1/2" : ""} flex-shrink-0`}>
                <img
                    src={event.images?.[0] || "/placeholder.jpg"}
                    alt={event.title}
                    className={`w-full object-cover ${expanded ? "h-full max-h-[700px] rounded-l-xl" : "h-64 rounded-t-xl"
                        }`}
                    style={{ aspectRatio: expanded ? "4 / 3" : undefined }}
                />
            </div>

            <div className="p-4 flex-1">
                <p className="text-sm text-rose-600 mb-1 flex items-center gap-1">
                    <CalendarDays size={16} className="stroke-rose-600" />
                    {event.date}
                </p>
                {event.tags && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {event.tags.map((tag, i) => (
                            <span
                                key={i}
                                className={`text-xs font-medium px-2 py-1 rounded-full ${tagColors[tag] || "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {tag}
                            </span>

                        ))}
                    </div>
                )}

                <h3 className="text-lg font-bold text-brand-dark dark:text-brand-light mb-2">
                    {event.title}
                </h3>

                <p
                    className={`text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line ${expanded ? "mb-3" : "line-clamp-4 mb-2"
                        }`}
                >
                    {event.description}
                </p>

                {expanded && (
                    <>
                        {event.instagram && (
                            <a
                                href={`https://www.instagram.com/p/${event.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-rose-600 hover:underline block mb-2"
                            >
                                Показать Instagram-пост
                            </a>
                        )}
                        {event.images?.length > 1 && (
                            <ImageGallery
                                images={event.images}
                                onClickImage={(i) => setLightboxIndex(i)}
                            />
                        )}

                        <Lightbox
                            open={lightboxIndex >= 0}
                            close={() => setLightboxIndex(-1)}
                            index={lightboxIndex}
                            slides={event.images.map((img) => ({ src: img }))}
                        />
                    </>
                )}

                <button
                    onClick={onToggle}
                    className="text-sm text-brand-dark dark:text-brand-light hover:underline mt-4"
                >
                    {expanded ? "Скрыть" : "Подробнее"}
                </button>
            </div>
        </div>
    )
}

export default EventCard
