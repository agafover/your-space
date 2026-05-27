// Accept either the bare post shortcode or a pasted URL like
// "https://www.instagram.com/p/SHORTCODE/" or "/reel/SHORTCODE/".
export function sanitizeInstagramPostId(input) {
  if (!input) return ""
  const trimmed = String(input).trim()
  const fromUrl = trimmed.match(/instagram\.com\/(?:p|reel|reels)\/([^/?#\s]+)/i)
  if (fromUrl) return fromUrl[1]
  return trimmed.replace(/^\/+|\/+$/g, "")
}

// Direct iframe to Instagram's /embed/ endpoint. This gives us exact control
// over width and height, unlike the official embed.js script which picks its
// own dimensions and ignores wrapper constraints.
function InstagramEmbed({ postId }) {
  const clean = sanitizeInstagramPostId(postId)
  if (!clean) return null

  return (
    <iframe
      src={`https://www.instagram.com/p/${clean}/embed/`}
      title="Instagram post"
      loading="lazy"
      scrolling="no"
      allow="encrypted-media"
      style={{
        display: "block",
        margin: "0 auto",
        width: "100%",
        maxWidth: "440px",
        height: "500px",
        border: "none",
        borderRadius: "8px",
        background: "#FFF",
      }}
    />
  )
}

export default InstagramEmbed
