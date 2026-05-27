import { useEffect, useMemo, useState } from "react"
import { Plus, Edit2, Trash2, Save, X, Star, AlertTriangle } from "lucide-react"
import { supabase } from "../../lib/supabase"
import ImageUploader from "../../components/admin/ImageUploader"

function normalizeTitle(t) {
  return (t ?? "").trim().toLowerCase().replace(/\s+/g, " ")
}

const MONTH_LABELS = [
  "январь", "февраль", "март", "апрель", "май", "июнь",
  "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",
]

// Default suggestions shown even before any books have genres set in the DB.
// At runtime these are merged with whatever distinct genres exist in `books`.
const DEFAULT_GENRES = [
  "классика", "современная проза", "фантастика", "фэнтези",
  "детектив", "антиутопия", "мистика", "нон-фикшн",
  "психология", "биография", "исторический роман", "военная проза",
]

function MonthYearPicker({ value, onChange }) {
  // Local state holds the user's partial selection (e.g. month picked but
  // year still empty) without bouncing it back through `value` mid-edit.
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")

  useEffect(() => {
    const [y = "", m = ""] = (value || "").split("-")
    setYear(y)
    setMonth(m)
  }, [value])

  const thisYear = new Date().getFullYear()
  const years = []
  for (let y = thisYear - 5; y <= thisYear + 2; y++) years.push(y)

  function update(newYear, newMonth) {
    setYear(newYear)
    setMonth(newMonth)
    if (newYear && newMonth) {
      onChange(`${newYear}-${String(newMonth).padStart(2, "0")}`)
    } else {
      onChange("")
    }
  }

  return (
    <div className="flex gap-2">
      <select
        value={month}
        onChange={(e) => update(year, e.target.value)}
        className={`${inputCls} flex-1`}
      >
        <option value="">— месяц —</option>
        {MONTH_LABELS.map((label, i) => (
          <option key={i} value={String(i + 1).padStart(2, "0")}>{label}</option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => update(e.target.value, month)}
        className={`${inputCls} w-28`}
      >
        <option value="">— год —</option>
        {years.map((y) => (
          <option key={y} value={String(y)}>{y}</option>
        ))}
      </select>
    </div>
  )
}

const emptyBook = {
  title: "",
  author: "",
  description: "",
  cover_url: "",
  read_month: "",
  is_current: false,
  instagram_post_id: "",
  rating: "",
}

function BookForm({ initial, onSave, onCancel, saving, otherBooks = [] }) {
  const [form, setForm] = useState({
    title: initial.title ?? "",
    author: initial.author ?? "",
    description: initial.description ?? "",
    cover_url: initial.cover_url ?? "",
    // Database stores DATE (YYYY-MM-DD); the form takes a month-only string (YYYY-MM).
    read_month: initial.read_month ? initial.read_month.slice(0, 7) : "",
    is_current: initial.is_current ?? false,
    instagram_post_id: initial.instagram_post_id ?? "",
    rating: initial.rating ?? "",
    genre: initial.genre ?? "",
  })

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const duplicate = useMemo(() => {
    const norm = normalizeTitle(form.title)
    if (!norm) return null
    return otherBooks.find((b) => normalizeTitle(b.title) === norm) ?? null
  }, [form.title, otherBooks])

  const genreSuggestions = useMemo(() => {
    const fromDb = otherBooks.map((b) => b.genre).filter(Boolean)
    return Array.from(new Set([...DEFAULT_GENRES, ...fromDb])).sort((a, b) => a.localeCompare(b))
  }, [otherBooks])

  function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      description: form.description.trim() || null,
      cover_url: form.cover_url.trim() || null,
      // Expand YYYY-MM back to YYYY-MM-01 for the DATE column.
      read_month: form.read_month ? `${form.read_month}-01` : null,
      is_current: !!form.is_current,
      instagram_post_id: form.instagram_post_id.trim() || null,
      rating: form.rating === "" ? null : Number(form.rating),
      genre: form.genre.trim() || null,
    }
    onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-night-surface rounded-xl shadow p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Название" required>
          <input type="text" required value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
          {duplicate && (
            <div className="mt-2 flex items-start gap-2 text-xs p-2 rounded bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800/40">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>
                Такую книгу уже читали: <strong>«{duplicate.title}»</strong>
                {duplicate.author && <> — {duplicate.author}</>}
                {duplicate.read_month && <> ({duplicate.read_month.slice(0, 7)})</>}
              </span>
            </div>
          )}
        </Field>
        <Field label="Автор" required>
          <input type="text" required value={form.author} onChange={(e) => set("author", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Месяц обсуждения">
          <MonthYearPicker value={form.read_month} onChange={(v) => set("read_month", v)} />
        </Field>
        <Field label="Рейтинг (0–5)" hint="оставь пустым, если ещё нет">
          <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => set("rating", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Жанр" hint="выбери из списка или впиши свой — новый жанр запомнится">
          <input
            type="text"
            value={form.genre}
            onChange={(e) => set("genre", e.target.value)}
            className={inputCls}
            list="known-genres"
          />
          <datalist id="known-genres">
            {genreSuggestions.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </Field>
        <Field label="Обложка" hint="можно вставить URL или загрузить файл">
          {form.cover_url && (
            <img src={form.cover_url} alt="" className="mb-2 h-24 object-cover rounded border border-brand-dark/10 dark:border-night-border" />
          )}
          <div className="flex gap-2">
            <input type="text" placeholder="/books/example.jpg или https://..." value={form.cover_url} onChange={(e) => set("cover_url", e.target.value)} className={inputCls} />
            <ImageUploader bucket="book-covers" onUploaded={(url) => set("cover_url", url)} />
          </div>
        </Field>
        <Field label="Instagram post ID" hint="часть URL после /p/, например DFTJd__tRz8">
          <input type="text" value={form.instagram_post_id} onChange={(e) => set("instagram_post_id", e.target.value)} className={inputCls} />
        </Field>
      </div>
      <Field label="Описание">
        <textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-brand-text dark:text-night-text">
        <input type="checkbox" checked={form.is_current} onChange={(e) => set("is_current", e.target.checked)} />
        Текущая книга месяца (только одна одновременно)
      </label>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-brand-dark dark:border-night-border text-brand-text dark:text-night-text">
          <X size={16} className="inline mr-1" /> Отмена
        </button>
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-brand-dark dark:bg-rose text-white dark:text-night disabled:opacity-50">
          <Save size={16} className="inline mr-1" /> {saving ? "Сохранение…" : "Сохранить"}
        </button>
      </div>
    </form>
  )
}

const inputCls = "w-full px-3 py-2 border rounded-md bg-white dark:bg-night text-brand-text dark:text-night-text"

function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-brand-text dark:text-night-text mb-1">
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-brand-text/60 dark:text-night-muted mt-1">{hint}</span>}
    </label>
  )
}

function AdminBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function reload() {
    const { data, error } = await supabase.from("books").select("*").order("read_month", { ascending: false, nullsLast: true })
    if (error) setError(error.message)
    else setBooks(data ?? [])
    setLoading(false)
  }

  useEffect(() => { reload() }, [])

  async function handleSave(id, payload) {
    setSaving(true)
    setError(null)

    // If marking this book as current, clear is_current on all other books first.
    if (payload.is_current) {
      const { error: clearErr } = await supabase.from("books").update({ is_current: false }).eq("is_current", true)
      if (clearErr) { setError(clearErr.message); setSaving(false); return }
    }

    const { error: saveErr } = id
      ? await supabase.from("books").update(payload).eq("id", id)
      : await supabase.from("books").insert(payload)

    setSaving(false)
    if (saveErr) { setError(saveErr.message); return }

    setEditingId(null)
    setCreating(false)
    reload()
  }

  async function handleDelete(id) {
    if (!confirm("Удалить эту книгу?")) return
    const { error: delErr } = await supabase.from("books").delete().eq("id", id)
    if (delErr) { setError(delErr.message); return }
    reload()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-brand-text dark:text-night-text">Книги ({books.length})</h2>
        {!creating && !editingId && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-dark dark:bg-rose text-white dark:text-night hover:opacity-90 transition"
          >
            <Plus size={16} /> Добавить книгу
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-3 rounded bg-red-100 text-red-800 text-sm">{error}</div>}

      {creating && (
        <div className="mb-6">
          <BookForm
            initial={emptyBook}
            saving={saving}
            otherBooks={books}
            onSave={(payload) => handleSave(null, payload)}
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      {loading ? (
        <p className="text-brand-text dark:text-night-muted">Загрузка…</p>
      ) : (
        <ul className="space-y-3">
          {books.map((book) =>
            editingId === book.id ? (
              <li key={book.id}>
                <BookForm
                  initial={book}
                  saving={saving}
                  otherBooks={books.filter((b) => b.id !== book.id)}
                  onSave={(payload) => handleSave(book.id, payload)}
                  onCancel={() => setEditingId(null)}
                />
              </li>
            ) : (
              <li
                key={book.id}
                className="flex items-center gap-4 p-4 bg-white dark:bg-night-surface rounded-xl shadow"
              >
                <img
                  src={book.cover_url || "/placeholder.jpg"}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-brand-text dark:text-night-text truncate">{book.title}</h3>
                    {book.is_current && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose/20 text-rose">текущая</span>
                    )}
                    {book.genre && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-brand-light/30 dark:bg-night-border text-brand-text dark:text-night-text">{book.genre}</span>
                    )}
                  </div>
                  <p className="text-sm text-brand-text/70 dark:text-night-muted">{book.author}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-brand-text/60 dark:text-night-muted">
                    {book.read_month && <span>{book.read_month}</span>}
                    {book.rating != null && (
                      <span className="flex items-center gap-1">
                        <Star size={12} fill="#facc15" stroke="#facc15" /> {book.rating}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(book.id)}
                    className="p-2 rounded hover:bg-brand-light/30 dark:hover:bg-night-border"
                    title="Изменить"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
                    title="Удалить"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  )
}

export default AdminBooks
