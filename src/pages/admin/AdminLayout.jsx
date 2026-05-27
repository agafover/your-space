import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { BookOpen, CalendarDays, LogOut, Home } from "lucide-react"
import { useAuth } from "../../lib/AuthContext"

function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { session, signOut } = useAuth()

  const navItems = [
    { to: "/admin", icon: Home, label: "Главная" },
    { to: "/admin/books", icon: BookOpen, label: "Книги" },
    { to: "/admin/events", icon: CalendarDays, label: "Мероприятия" },
  ]

  async function handleSignOut() {
    await signOut()
    navigate("/admin/login", { replace: true })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-brand-dark/20 dark:border-night-border">
        <h1 className="text-2xl font-bold text-brand-dark dark:text-night-text">Админка</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-brand-text dark:text-night-muted">{session?.user?.email}</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1 px-3 py-1 rounded-md border border-brand-dark dark:border-night-border text-brand-dark dark:text-night-text hover:bg-brand-dark hover:text-white dark:hover:bg-rose dark:hover:text-night transition"
          >
            <LogOut size={14} /> Выйти
          </button>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 mb-8">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                active
                  ? "bg-brand-dark text-white dark:bg-rose dark:text-night"
                  : "bg-white dark:bg-night-surface text-brand-text dark:text-night-text hover:bg-brand-light/30 dark:hover:bg-night-border"
              }`}
            >
              <Icon size={16} /> {label}
            </Link>
          )
        })}
      </nav>

      <Outlet />
    </div>
  )
}

export default AdminLayout
