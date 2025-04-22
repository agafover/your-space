import { Disclosure, Transition } from "@headlessui/react"
import { Menu, X, Moon, Sun } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

const navigation = [
  { name: "Главная", to: "/" },
  { name: "О нас", to: "/about" },
  { name: "Книжный клуб", to: "/books" },
  { name: "Мероприятия", to: "/events" },
  { name: "Афиша", to: "/calendar" },
  { name: "Образование", to: "/education" },
  { name: "Поездки", to: "/trips" },
  { name: "Контакты", to: "/contacts" },
]

function Header() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    } else if (savedTheme === "light") {
      setDarkMode(false)
      document.documentElement.classList.remove("dark")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setDarkMode(prefersDark)
      if (prefersDark) {
        document.documentElement.classList.add("dark")
      }
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  return (
    <Disclosure
      as="nav"
      className="bg-brand dark:bg-brand-dark text-brand-dark dark:text-brand-light shadow-md sticky top-0 z-50"
    >
      {({ open }) => (
        <>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Название */}
            <Link to="/" className="text-2xl font-bold text-brand-dark dark:text-brand-light whitespace-nowrap">
              Your Space
            </Link>

            {/* Навигация и переключатель темы */}
            <div className="flex items-center gap-4">
              {/* Desktop menu */}
              <div className="hidden md:flex gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="text-sm hover:underline text-brand-dark dark:text-brand-light"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Disclosure.Button className="text-brand-dark dark:text-brand-light">
                  {open ? <X size={24} /> : <Menu size={24} />}
                </Disclosure.Button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-brand-dark dark:text-brand-light transition"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-y-0 opacity-0"
            enterTo="transform scale-y-100 opacity-100"
            leave="transition duration-150 ease-in"
            leaveFrom="transform scale-y-100 opacity-100"
            leaveTo="transform scale-y-0 opacity-0"  
          >
            <Disclosure.Panel className="md:hidden px-4 pb-4 space-y-2 origin-top">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="block text-brand-dark dark:text-brand-light hover:underline"
                >
                  {item.name}
                </Link>
              ))}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}

export default Header
