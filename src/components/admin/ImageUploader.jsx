import { useState } from "react"
import { Upload } from "lucide-react"
import { supabase } from "../../lib/supabase"

// Single-file mode: onUploaded(url: string)
// Multi-file mode: onUploaded(urls: string[])
function ImageUploader({ bucket, onUploaded, multiple = false, label = "Загрузить" }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  async function handleChange(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    setError(null)

    const urls = []
    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const path = `${crypto.randomUUID()}.${ext}`
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
        contentType: file.type || `image/${ext}`,
        cacheControl: "3600",
        upsert: false,
      })
      if (upErr) {
        setError(upErr.message)
        continue
      }
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
      urls.push(publicUrl)
    }

    setUploading(false)
    e.target.value = ""
    if (urls.length === 0) return
    multiple ? onUploaded(urls) : onUploaded(urls[0])
  }

  return (
    <div className="inline-flex flex-col">
      <label className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-brand-dark dark:border-night-border text-brand-text dark:text-night-text bg-white dark:bg-night cursor-pointer hover:bg-brand-light/30 dark:hover:bg-night-border transition whitespace-nowrap">
        <Upload size={14} />
        {uploading ? "Загрузка…" : label}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  )
}

export default ImageUploader
