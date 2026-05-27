import { Mail } from 'lucide-react'

function Contacts() {
  return (
    <div className="max-w-xl mx-auto py-10 px-4 text-center">
      <h1 className="text-3xl font-bold text-brand-dark dark:text-night-text mb-6">
        Контакты
      </h1>

      <p className="text-lg text-gray-700 dark:text-night-text mb-4">
        Если хочешь задать вопрос, предложить идею или узнать больше о сообществе — напиши нам!
      </p>

      <a
        href="mailto:community.yourspace@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-brand-dark dark:border-night-border text-brand-dark dark:text-night-text px-4 py-2 rounded-xl hover:bg-brand-dark hover:text-white dark:hover:bg-rose dark:hover:text-night transition"
      >
        <Mail /> Связаться с нами
      </a>
    </div>
  )
}

export default Contacts
