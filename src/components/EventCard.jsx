import { CalendarDays, Instagram } from "lucide-react"
import { useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

function EventCard({ event, expanded, onToggle }) {
    const [lightboxIndex, setLightboxIndex] = useState(-1)
    const tagColors = {
        "Мастер-класс": "bg-green-100 text-green-800",
        "Культура": "bg-purple-100 text-purple-800",
        "Поездки": "bg-blue-100 text-blue-700",
        "Развлечения": "bg-yellow-100 text-yellow-700"
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
                            <div className={`w-full ${expanded ? "lg:w-1/2 max-h-[700px]" : ""} flex-shrink-0`}>
                            <div className="h-full">
                              <img
                                src={event.images?.[0] || "/placeholder.jpg"}
                                alt={event.title}
                                className={`w-full object-cover ${expanded ? "h-full rounded-l-xl" : "h-64 rounded-t-xl"}`}
                                style={{ aspectRatio: expanded ? "4 / 3" : undefined }}
                              />
                            </div>
                          </div>
                          
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
