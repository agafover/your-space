export function sanitizeInstagramPostId(input) {
  if (!input) return ""
  const trimmed = String(input).trim()
  const fromUrl = trimmed.match(/instagram\.com\/(?:p|reel|reels)\/([^/?#\s]+)/i)
  if (fromUrl) return fromUrl[1]
  return trimmed.replace(/^\/+|\/+$/g, "")
}

// Crop the Instagram embed to show only the photo area:
//   - hide top header (~56px) via negative margin on the iframe
//   - hide everything below the photo via overflow:hidden on a square wrapper
// Carousel arrows / pagination dots still work inside the photo region.
function InstagramEmbed({ postId }) {
  const clean = sanitizeInstagramPostId(postId)
  if (!clean) return null

  const SIZE = 440          // photo edge (matches iframe width)
  const HEADER_HEIGHT = 56  // Instagram embed header height
  const IFRAME_TALL = 700   // tall enough to contain header + photo + extras

  return (
    <div
      style={{
        width: "100%",
        maxWidth: `${SIZE}px`,
        margin: "0 auto",
        borderRadius: "8px",
        overflow: "hidden",
        aspectRatio: "1 / 1",
        background: "#FFF",
      }}
    >
      <iframe
        src={`https://www.instagram.com/p/${clean}/embed/`}
        title="Instagram post"
        loading="lazy"
        scrolling="no"
        allow="encrypted-media"
        style={{
          display: "block",
          width: "100%",
          height: `${IFRAME_TALL}px`,
          border: "none",
          marginTop: `-${HEADER_HEIGHT}px`,
        }}
      />
    </div>
  )
}

export default InstagramEmbed
