import {
  Instagram,
  Mail,
  Newspaper,
  HelpCircle, Copyright,
  Lock,
} from "lucide-react"
import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../lib/AuthContext"

function Footer() {
  const footerRef = useRef()
  const { session } = useAuth()

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
      className="bg-white dark:bg-night text-brand-dark dark:text-night-text px-6 py-10 mt-10 border-t dark:border-night-border opacity-0 transition-opacity duration-700"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Лого и описание */}
        <div>
          <h3 className="font-bold text-lg text-brand-dark dark:text-night-text">
            Your Space
          </h3>
          <p className="mt-2 text-gray-600 dark:text-night-text leading-relaxed">
            Женское сообщество в Праге — пространство для самовыражения,
            вдохновения и общения.
          </p>
          <div className="flex gap-3 mt-3 text-brand-dark dark:text-night-text">
            <a href="https://www.instagram.com/community.yourspace/"><Instagram size={18} /></a>
          </div>
        </div>

        {/* Навигация */}
        <div>
          <h4 className="font-semibold mb-2">Навигация</h4>
          <ul className="space-y-1 text-gray-600 dark:text-night-text ">
            <li><a href="/books" className="hover:underline">Книжный клуб</a></li>
            <li><a href="/events" className="hover:underline">Мероприятия</a></li>
            <li><a href="/calendar" className="hover:underline">Афиша</a></li>
            <li><a href="/about" className="hover:underline">О нас</a></li>
          </ul>
        </div>

        {/* Сообщество */}
        <div>
          <h4 className="font-semibold mb-2">Сообщество</h4>
          <ul className="space-y-1 text-gray-600 dark:text-night-text">
            <li>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScu1AP1n_iihe5KNLnAvnqLKSYN6-T72syL-cTzJ2f9lF0FyQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Присоединиться
              </a>
            </li>
            <li>
              <a href="/faq" className="flex items-center gap-2 text-gray-700 dark:text-night-text hover:underline">
                <HelpCircle size={16} />
                FAQ
              </a>
            </li>
          </ul>

        </div>

        {/* Контакты */}
        <div>
          <h4 className="font-semibold mb-2">Контакты</h4>
          <ul className="space-y-2 text-gray-600 dark:text-night-text">
            <div className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              <a href="mailto:community.yourspace@gmail.com" className="text-gray-700 dark:text-night-text hover:underline">
                community.yourspace@gmail.com
              </a>
            </div>         
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 text-xs text-gray-500 dark:text-night-muted">
        <p className="text-center">© {new Date().getFullYear()} Your Space.</p>
        <span className="hidden sm:inline">·</span>
        <Link
          to={session ? "/admin" : "/admin/login"}
          className={`inline-flex items-center gap-1 self-center hover:underline ${
            session ? "text-brand-dark dark:text-rose font-medium" : ""
          }`}
        >
          <Lock size={12} />
          {session ? "Админка" : "Войти"}
        </Link>
      </div>
    </footer>
  )
}

export default Footer
