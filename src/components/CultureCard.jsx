import { useState } from "react"

function CultureCard({ event }) {
    const [showInsta, setShowInsta] = useState(false)

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row mb-8">
            {/* Главное фото */}
            <div className="md:w-1/2 w-full flex-1">
                <img
                    src={event.images[0]}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Описание */}
            <div className="p-6 bg-rose-50 md:w-1/2 w-full flex-1 flex flex-col justify-between">
                <p className="text-sm text-rose-600 font-semibold mb-1">
                    🗓 {event.date}
                </p>

                <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>

                <p className="text-md text-gray-700 mb-4 whitespace-pre-line">
                    {event.description}
                </p>

                {/* Кнопка Instagram */}
                {event.instagram && (
                    <div className="mt-4">
                        {!showInsta ? (
                            <button
                                onClick={() => setShowInsta(true)}
                                className="text-sm text-pink-600 hover:underline"
                            >
                                Показать Instagram-пост
                            </button>
                        ) : (
                            <>
                                <iframe
                                    src={`https://www.instagram.com/p/${event.instagram}/embed`}
                                    width="100%"
                                    height="800"
                                    className="mx-auto rounded-xl"
                                    allowtransparency="true"
                                    allow="encrypted-media"
                                ></iframe>
                                <button
                                    onClick={() => setShowInsta(false)}
                                    className="text-sm text-gray-600 hover:underline mt-2 block"
                                >
                                    Скрыть пост
                                </button>
                            </>
                        )}
                    </div>
                )}


                {/* Дополнительные фото */}
                {event.images.length > 1 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {event.images.slice(1).map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`Фото ${i + 2}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CultureCard
