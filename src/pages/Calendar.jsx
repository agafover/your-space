import { useState } from "react";
import { Calendar as CalendarIcon, Clock3, MapPin, Check } from "lucide-react";
import { calendarEvents } from "../components/CalendarData";  // <--- добавляем импорт событий!

function Calendar() {
  const [participation, setParticipation] = useState({});

  const toggleParticipation = (index) => {
    setParticipation((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-brand-dark dark:text-brand-light mb-8 text-left">Афиша мероприятий</h1>
  
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {calendarEvents.map((event, index) => (
          <li
            key={index}
            className="bg-white dark:bg-brand-text rounded-xl shadow hover:shadow-xl transform hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6 flex flex-col justify-between h-full">
              <div>
                <p className="text-sm text-brand-dark dark:text-brand-light mb-1 flex items-center gap-1">
                  <CalendarIcon size={16} />
                  {event.date}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <Clock3 size={16} />
                  {event.time}
                </p>
                <h3 className="text-lg font-semibold text-brand-text dark:text-brand-light mb-2">{event.title}</h3>
                {/* <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <MapPin size={16} />
                  {event.format}
                </p> */}
              </div>
  
              <button
                type="button"
                onClick={() => toggleParticipation(index)}
                className={`mt-6 px-4 py-2 rounded-xl text-sm transition flex items-center justify-center gap-2
                  ${participation[index]
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "border border-brand-dark dark:border-brand-light text-brand-dark dark:text-brand-light hover:bg-brand-dark hover:text-white dark:hover:bg-brand-light dark:hover:text-brand-dark"
                  }`}
              >
                {participation[index] ? (
                  <>
                    <Check size={16} /> Участвую!
                  </>
                ) : (
                  "Хочу участвовать"
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}  

export default Calendar;
