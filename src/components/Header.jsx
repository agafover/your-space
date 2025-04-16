import { Disclosure } from "@headlessui/react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

const navigation = [
  { name: "Главная", to: "/" },
  { name: "О нас", to: "/about" },
  { name: "Книжный клуб", to: "/books" },
  { name: "Культура", to: "/culture" },
  { name: "Мероприятия", to: "/events" },
  { name: "Календарь", to: "/calendar" },
  { name: "Образование", to: "/education" },
  { name: "Поездки", to: "/trips" },
]

function Header() {
  return (
    <Disclosure as="nav" className="bg-white shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-brand-dark">Your Space</div>
            <div className="hidden md:flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="text-sm text-brand-dark hover:underline"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="md:hidden">
              <Disclosure.Button className="text-brand-dark">
                {open ? <X size={24} /> : <Menu size={24} />}
              </Disclosure.Button>
            </div>
          </div>

          {/* Мобильное меню */}
          <Disclosure.Panel className="md:hidden px-4 pb-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="block text-brand-dark hover:underline"
              >
                {item.name}
              </Link>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Header
