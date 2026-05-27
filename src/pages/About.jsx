import { Heart } from "lucide-react"

function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-center">
      <h1 className="text-4xl font-extrabold text-brand-dark dark:text-night-text mb-6">
        О нас
      </h1>

      <p className="text-lg text-brand-text dark:text-night-text mb-4">
        Мы — женское сообщество для самовыражения, поддержки и вдохновения.
      </p>

      <p className="text-lg text-brand-text dark:text-night-text mb-6">
        Истоки сообщества — Книжный клуб, которому уже 3 года. За это время наши встречи стали не только про книги, но и про поддержку,
        советы и новые знакомства. Формат клуба мы переросли — теперь мы действуем как сообщество, чтобы вдохновляющих встреч,
        тёплого общения и новых подруг было ещё больше 🤍
      </p>

      <p className="text-lg text-brand-text dark:text-night-text mb-6">
        Мы проводим читательские и культурные встречи, воркшопы, путешествуем, занимаемся спортом, танцуем и просто встречаемся пообщаться.
        Присоединяйтесь к нам — будем рады познакомиться!
      </p>

      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLScu1AP1n_iihe5KNLnAvnqLKSYN6-T72syL-cTzJ2f9lF0FyQ/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-brand-dark dark:border-night-border text-brand-dark dark:text-night-text px-4 py-2 rounded-xl hover:bg-brand-dark hover:text-white dark:hover:bg-rose dark:hover:text-night transition"
      >
        <Heart /> Стать частью сообщества
      </a>
    </div>
  )
}

export default About
