import { HelpCircle } from "lucide-react"

function FAQ() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-dark dark:text-brand-light mb-8 text-center flex items-center justify-center gap-2">
        <HelpCircle size={28} /> Часто задаваемые вопросы
      </h1>

      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <div>
          <h2 className="text-xl font-semibold mb-2">Как попасть в сообщество?</h2>
          <p>
            Чтобы стать частью сообщества, просто
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScu1AP1n_iihe5KNLnAvnqLKSYN6-T72syL-cTzJ2f9lF0FyQ/viewform"
              className="text-pink-600 underline ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              заполните анкету
            </a>.
            После этого админы проверят её в течение 2–3 дней и свяжутся с вами.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Это платно?</h2>
          <p>
            Присоединиться к сообществу — бесплатно. Вы платите только за участие в конкретных мероприятиях (например, аренда зала, мастер-классы и т.д.).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Могу ли я участвовать, если не живу в Праге?</h2>
          <p>
            На данный момент все наши мероприятия проходят офлайн в Праге, за исключением поездок.
          </p>
        </div>

        
      </div>
    </div>
  )
}

export default FAQ
