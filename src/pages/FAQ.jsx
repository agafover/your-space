import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const questions = [
    {
      title: "Как попасть в сообщество?",
      answer: (
        <p>
          Чтобы стать частью сообщества, просто
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScu1AP1n_iihe5KNLnAvnqLKSYN6-T72syL-cTzJ2f9lF0FyQ/viewform"
            className="text-brand-dark underline ml-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            заполни анкету
          </a>
          . Мы проверим её в течение 2–3 дней и напишем тебе.
        </p>
      )
    },
    {
      title: "Это платно?",
      answer: (
        <p>
          Присоединиться к сообществу — бесплатно. Ты платишь только за конкретные мероприятия, если они требуют расходов (например, аренда зала, материалы для мастер-класса и т.д.).
        </p>
      )
    },
    {
      title: "Можно ли участвовать, если я не в Праге?",
      answer: (
        <p>
          Пока что все мероприятия проходят офлайн в Праге (за редкими исключениями, например, поездками).
        </p>
      )
    },
    {
      title: "Кто выбирает книги?",
      answer: (
        <p>
          Каждые 3 месяца мы вместе выбираем книги. Ты можешь предложить свою, и потом мы голосуем в телеграм-канале (доступ к которому получаешь после заполнения{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScu1AP1n_iihe5KNLnAvnqLKSYN6-T72syL-cTzJ2f9lF0FyQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-dark underline"
          >
            анкеты
          </a>{" "}
          и её одобрения админами). Топ-3 книг попадают в наш список чтения на ближайшие месяцы. Мы всегда открыты твоим идеям!
        </p>
      )
    },
    {
      title: "А мероприятия кто придумывает?",
      answer: (
        <p>
          Мероприятие может предложить любая участница. Если идея вдохновляет, мы создаём опрос в чате, и если набирается достаточно желающих — организуем! Будь то лекция, мастер-класс или просто тёплая встреча за чаем — всё начинается с твоего предложения.
        </p>
      )
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-8 text-center flex items-center justify-center gap-2">
        <HelpCircle size={28} /> Часто задаваемые вопросы
      </h1>

      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        {questions.map((q, i) => (
          <div key={i} className="bg-white dark:bg-brand-text border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <button
              onClick={() => toggle(i)}
              className="flex justify-between items-center w-full text-left"
            >
              <h2 className="text-lg font-semibold text-brand-dark dark:text-brand-light">
                {q.title}
              </h2>
              {openIndex === i ? (
                <ChevronUp size={20} className="text-brand-dark dark:text-brand-light" />
              ) : (
                <ChevronDown size={20} className="text-brand-dark dark:text-brand-light" />
              )}
            </button>
            {openIndex === i && <div className="mt-3 text-sm">{q.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ