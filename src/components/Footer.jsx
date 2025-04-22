import {
  Instagram,
  Mail,
  Newspaper,
  HelpCircle, Copyright
} from "lucide-react"
import { useEffect, useRef } from "react"

function Footer() {
  const footerRef = useRef()

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          footer.classList.add("animate-fadeInUp")
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(footer)

    return () => observer.disconnect()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="bg-white dark:bg-brand-dark text-brand-dark dark:text-brand-light px-6 py-10 mt-10 border-t dark:border-brand opacity-0 transition-opacity duration-700"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Лого и описание */}
        <div>
          <h3 className="font-bold text-lg text-brand-dark dark:text-brand-light">
            Your Space
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">
            Женское сообщество в Праге — пространство для самовыражения,
            вдохновения и общения.
          </p>
          <div className="flex gap-3 mt-3 text-brand-dark dark:text-brand-light">
            <a href="https://www.instagram.com/community.yourspace/"><Instagram size={18} /></a>
          </div>
        </div>

        {/* Навигация */}
        <div>
          <h4 className="font-semibold mb-2">Навигация</h4>
          <ul className="space-y-1 text-gray-600 dark:text-gray-300">
            <li><a href="/books">Книжный клуб</a></li>
            <li><a href="/events">Мероприятия</a></li>
            <li><a href="/calendar">Афиша</a></li>
            <li><a href="/education">Образование</a></li>
            <li><a href="/about">О нас</a></li>
          </ul>
        </div>

        {/* Сообщество */}
        <div>
          <h4 className="font-semibold mb-2">Сообщество</h4>
          <ul className="space-y-1 text-gray-600 dark:text-gray-300">
            <li><a href="#">Присоединиться</a></li>
            <li><a href="#">Правила</a></li>
          </ul>
        </div>

        {/* Контакты */}
        <div>
          <h4 className="font-semibold mb-2">Контакты</h4>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              <a href="mailto:community.yourspace@gmail.com" className="text-gray-700 hover:underline">
                community.yourspace@gmail.com
              </a>
            </div>
            <li className="flex items-center gap-2">
              <HelpCircle size={16} /> FAQ
            </li>
          </ul>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Your Space. Все права защищены.
      </p>
    </footer>
  )
}

export default Footer
