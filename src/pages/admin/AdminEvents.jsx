import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2, Save, X, ImagePlus } from "lucide-react"
import { supabase } from "../../lib/supabase"
import ImageUploader from "../../components/admin/ImageUploader"

const KNOWN_TAGS = [
  "Мастер-класс", "Культура", "Поездки", "Развлечения",
  "Образование", "Спорт", "Книги",
  "Открытое мероприятие", "Закрытое мероприятие",
]

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

function EventForm({ initial, initialImages, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    title: initial.title ?? "",
    description: initial.description ?? "",
    event_date: initial.event_date ?? "",
    tags: initial.tags ?? [],
    is_members_only: initial.is_members_only ?? true,
    instagram_post_id: initial.instagram_post_id ?? "",
    cover_url: initial.cover_url ?? "",
  })
  const [images, setImages] = useState(initialImages.map(img => img.image_url))
  const [newImageUrl, setNewImageUrl] = useState("")

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })) }
  function toggleTag(tag) {
    set("tags", form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag])
  }
  function addImage() {
    const url = newImageUrl.trim()
    if (!url) return
    setImages([...images, url])
    setNewImageUrl("")
  }
  function removeImage(idx) {
    setImages(images.filter((_, i) => i !== idx))
  }
  function moveImage(idx, dir) {
    const next = [...images]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setImages(next)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      event_date: form.event_date,
      tags: form.tags,
      is_members_only: !!form.is_members_only,
      instagram_post_id: form.instagram_post_id.trim() || null,
      cover_url: form.cover_url.trim() || images[0] || null,
    }
    onSave(payload, images)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-night-surface rounded-xl shadow p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Название" required>
          <input type="text" required value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Дата" required>
          <input type="date" required value={form.event_date} onChange={(e) => set("event_date", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Обложка" hint="если пусто, возьмётся первая картинка из галереи">
          {form.cover_url && (
            <img src={form.cover_url} alt="" className="mb-2 h-24 object-cover rounded border border-brand-dark/10 dark:border-night-border" />
          )}
          <div className="flex gap-2">
            <input type="text" value={form.cover_url} onChange={(e) => set("cover_url", e.target.value)} className={inputCls} />
            <ImageUploader bucket="event-images" onUploaded={(url) => set("cover_url", url)} />
          </div>
        </Field>
        <Field label="Instagram post ID">
          <input type="text" value={form.instagram_post_id} onChange={(e) => set("instagram_post_id", e.target.value)} className={inputCls} />
        </Field>
      </div>

      <Field label="Описание">
        <textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
      </Field>

      <div>
        <span className="block text-sm font-medium text-brand-text dark:text-night-text mb-2">Теги</span>
        <div className="flex flex-wrap gap-2">
          {KNOWN_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`text-xs px-3 py-1 rounded-full border transition ${
                form.tags.includes(tag)
                  ? "bg-brand-dark text-white border-brand-dark dark:bg-rose dark:text-night dark:border-rose"
                  : "bg-white dark:bg-night text-brand-text dark:text-night-text border-brand-dark/30 dark:border-night-border"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-brand-text dark:text-night-text">
        <input type="checkbox" checked={form.is_members_only} onChange={(e) => set("is_members_only", e.target.checked)} />
        Закрытое мероприятие (только для участниц)
      </label>

      <div>
        <span className="block text-sm font-medium text-brand-text dark:text-night-text mb-2">
          Галерея изображений ({images.length})
        </span>
        <div className="flex gap-2 mb-3 flex-wrap">
          <input
            type="text"
            placeholder="URL картинки: /images/foo.jpg или https://..."
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className={`${inputCls} flex-1 min-w-0`}
          />
          <button
            type="button"
            onClick={addImage}
            className="px-3 py-2 rounded-lg border border-brand-dark dark:border-night-border text-brand-text dark:text-night-text whitespace-nowrap"
          >
            <ImagePlus size={16} className="inline mr-1" /> По URL
          </button>
          <ImageUploader
            bucket="event-images"
            multiple
            label="Загрузить файлы"
            onUploaded={(urls) => setImages((prev) => [...prev, ...urls])}
          />
        </div>
        <ul className="space-y-2">
          {images.map((url, idx) => (
            <li key={`${idx}-${url}`} className="flex items-center gap-2 p-2 bg-white dark:bg-night rounded border border-brand-dark/10 dark:border-night-border">
              <img src={url} alt="" className="w-12 h-12 object-cover rounded" />
              <span className="flex-1 text-xs text-brand-text dark:text-night-text truncate">{url}</span>
              <button type="button" onClick={() => moveImage(idx, -1)} disabled={idx === 0} className="p-1 disabled:opacity-30">↑</button>
              <button type="button" onClick={() => moveImage(idx, 1)} disabled={idx === images.length - 1} className="p-1 disabled:opacity-30">↓</button>
              <button type="button" onClick={() => removeImage(idx)} className="p-1 text-red-600">
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      </div>

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

function AdminEvents() {
  const [events, setEvents] = useState([])
  const [imagesByEventId, setImagesByEventId] = useState(new Map())
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function reload() {
    setLoading(true)
    const { data: evs, error: evErr } = await supabase.from("events").select("*").order("event_date", { ascending: false })
    if (evErr) { setError(evErr.message); setLoading(false); return }
    const ids = (evs ?? []).map(e => e.id)
    const { data: imgs } = ids.length
      ? await supabase.from("event_images").select("*").in("event_id", ids).order("position", { ascending: true })
      : { data: [] }
    const map = new Map()
    for (const img of imgs ?? []) {
      if (!map.has(img.event_id)) map.set(img.event_id, [])
      map.get(img.event_id).push(img)
    }
    setEvents(evs ?? [])
    setImagesByEventId(map)
    setLoading(false)
  }

  useEffect(() => { reload() }, [])

  async function handleSave(id, payload, imageUrls) {
    setSaving(true)
    setError(null)

    let eventId = id
    if (id) {
      const { error: updErr } = await supabase.from("events").update(payload).eq("id", id)
      if (updErr) { setError(updErr.message); setSaving(false); return }
    } else {
      const { data: created, error: insErr } = await supabase.from("events").insert(payload).select("id").single()
      if (insErr) { setError(insErr.message); setSaving(false); return }
      eventId = created.id
    }

    // Replace event_images: delete all existing rows, insert in order.
    const { error: delErr } = await supabase.from("event_images").delete().eq("event_id", eventId)
    if (delErr) { setError(delErr.message); setSaving(false); return }

    if (imageUrls.length) {
      const rows = imageUrls.map((url, i) => ({ event_id: eventId, image_url: url, position: i }))
      const { error: imgErr } = await supabase.from("event_images").insert(rows)
      if (imgErr) { setError(imgErr.message); setSaving(false); return }
    }

    setSaving(false)
    setEditingId(null)
    setCreating(false)
    reload()
  }

  async function handleDelete(id) {
    if (!confirm("Удалить это мероприятие? Все фото будут удалены.")) return
    const { error: delErr } = await supabase.from("events").delete().eq("id", id)
    if (delErr) { setError(delErr.message); return }
    reload()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-brand-text dark:text-night-text">Мероприятия ({events.length})</h2>
        {!creating && !editingId && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-dark dark:bg-rose text-white dark:text-night hover:opacity-90 transition"
          >
            <Plus size={16} /> Добавить мероприятие
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-3 rounded bg-red-100 text-red-800 text-sm">{error}</div>}

      {creating && (
        <div className="mb-6">
          <EventForm
            initial={{}}
            initialImages={[]}
            saving={saving}
            onSave={(payload, imgs) => handleSave(null, payload, imgs)}
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      {loading ? (
        <p className="text-brand-text dark:text-night-muted">Загрузка…</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event) =>
            editingId === event.id ? (
              <li key={event.id}>
                <EventForm
                  initial={event}
                  initialImages={imagesByEventId.get(event.id) ?? []}
                  saving={saving}
                  onSave={(payload, imgs) => handleSave(event.id, payload, imgs)}
                  onCancel={() => setEditingId(null)}
                />
              </li>
            ) : (
              <li
                key={event.id}
                className="flex items-center gap-4 p-4 bg-white dark:bg-night-surface rounded-xl shadow"
              >
                <img
                  src={event.cover_url || imagesByEventId.get(event.id)?.[0]?.image_url || "/placeholder.jpg"}
                  alt={event.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-brand-text dark:text-night-text truncate">{event.title}</h3>
                  <p className="text-sm text-brand-text/70 dark:text-night-muted">{event.event_date}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {event.tags?.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-brand-light/30 dark:bg-night-border text-brand-text dark:text-night-text">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-brand-text/60 dark:text-night-muted mt-1">
                    {(imagesByEventId.get(event.id) ?? []).length} фото
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(event.id)}
                    className="p-2 rounded hover:bg-brand-light/30 dark:hover:bg-night-border"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
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

export default AdminEvents
