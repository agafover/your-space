import { useEffect } from "react"

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
  useEffect(() => {
    ensureScript()
    processWhenReady(() => {
      if (window.instgrm) window.instgrm.Embeds.process()
    })
  }, [postId])

  if (!postId) return null

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink={`https://www.instagram.com/p/${postId}/`}
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
      <div style={{ padding: "16px" }}>
        <a
          href={`https://www.instagram.com/p/${postId}/`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#c13584", textDecoration: "underline" }}
        >
          Открыть пост в Instagram
        </a>
      </div>
    </blockquote>
  )
}

export default InstagramEmbed
