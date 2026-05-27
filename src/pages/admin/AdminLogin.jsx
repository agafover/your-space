import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../lib/AuthContext"

function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (session) {
    const from = location.state?.from ?? "/admin"
    navigate(from, { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (signInErr) {
      setError(signInErr.message)
      return
    }
    const from = location.state?.from ?? "/admin"
    navigate(from, { replace: true })
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold text-brand-dark dark:text-night-text mb-6 text-center">
        Вход в админку
      </h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-night-surface rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-text dark:text-night-text mb-1">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-night text-brand-text dark:text-night-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-text dark:text-night-text mb-1">Пароль</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 border rounded-md bg-white dark:bg-night text-brand-text dark:text-night-text"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-brand-text/60 dark:text-night-muted hover:text-brand-dark dark:hover:text-rose"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-dark dark:bg-rose text-white dark:text-night px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? "Вход…" : "Войти"}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
