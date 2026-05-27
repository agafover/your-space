import { useEffect } from "react"

// Accept either the bare post shortcode or a pasted URL like
// "https://www.instagram.com/p/SHORTCODE/" or "/reel/SHORTCODE/".
export function sanitizeInstagramPostId(input) {
  if (!input) return ""
  const trimmed = String(input).trim()
  const fromUrl = trimmed.match(/instagram\.com\/(?:p|reel|reels)\/([^/?#\s]+)/i)
  if (fromUrl) return fromUrl[1]
  return trimmed.replace(/^\/+|\/+$/g, "")
}

// Module-level state: load the Instagram embed script exactly once per page.
let scriptStatus = "idle" // "idle" | "loading" | "ready"
const pendingProcess = []

function ensureScript() {
  if (scriptStatus === "ready") {
    if (typeof window !== "undefined" && window.instgrm) {
      window.instgrm.Embeds.process()
    }
    return
  }
  if (scriptStatus === "loading") return
  if (typeof window === "undefined") return

  scriptStatus = "loading"
  const script = document.createElement("script")
  script.src = "https://www.instagram.com/embed.js"
  script.async = true
  script.onload = () => {
    scriptStatus = "ready"
    if (window.instgrm) window.instgrm.Embeds.process()
    pendingProcess.forEach((cb) => cb())
    pendingProcess.length = 0
  }
  document.body.appendChild(script)
}

function processWhenReady(cb) {
  if (scriptStatus === "ready") {
    cb()
  } else {
    pendingProcess.push(cb)
  }
}

function InstagramEmbed({ postId }) {
  const clean = sanitizeInstagramPostId(postId)

  useEffect(() => {
    ensureScript()
    processWhenReady(() => {
      if (window.instgrm) window.instgrm.Embeds.process()
    })
  }, [clean])

  if (!clean) return null

  const permalink = `https://www.instagram.com/p/${clean}/`

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink={permalink}
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: 0,
        margin: "0 auto",
        maxWidth: "540px",
        minWidth: "326px",
        padding: 0,
        width: "100%",
      }}
    >
      <div style={{ padding: "32px 16px", textAlign: "center", color: "#666", fontSize: "14px" }}>
        Загрузка поста…
        {" "}
        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#c13584", textDecoration: "underline" }}
        >
          открыть в Instagram
        </a>
      </div>
    </blockquote>
  )
}

export default InstagramEmbed
