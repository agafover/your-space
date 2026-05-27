import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { BookOpen, CalendarDays } from "lucide-react"
import { supabase } from "../../lib/supabase"

function AdminDashboard() {
  const [stats, setStats] = useState({ books: 0, events: 0 })

  useEffect(() => {
    async function load() {
      const [{ count: books }, { count: events }] = await Promise.all([
        supabase.from("books").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
      ])
      setStats({ books: books ?? 0, events: events ?? 0 })
    }
    load()
  }, [])

  const cards = [
    { to: "/admin/books", icon: BookOpen, label: "Книги", count: stats.books },
    { to: "/admin/events", icon: CalendarDays, label: "Мероприятия", count: stats.events },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {cards.map(({ to, icon: Icon, label, count }) => (
        <Link
          key={to}
          to={to}
          className="block p-8 bg-white dark:bg-night-surface rounded-xl shadow hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
        >
          <Icon className="text-brand-dark dark:text-rose mb-4" size={36} />
          <h2 className="text-xl font-semibold text-brand-text dark:text-night-text mb-1">{label}</h2>
          <p className="text-sm text-brand-text dark:text-night-muted">{count} в базе</p>
        </Link>
      ))}
    </div>
  )
}

export default AdminDashboard
