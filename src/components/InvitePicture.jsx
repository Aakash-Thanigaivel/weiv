const ROOT_WEBP = new Set(['engagement', 'reception', 'muhurutham', 'newarch'])
const MOBILE_WEBP = new Set([
  'engagement',
  'reception',
  'muhurutham',
  'newarch',
  'bridefather',
  'bridemother',
  'bridemomnddad',
  'groomfather',
  'groommom',
  'groommomnddad',
])

/**
 * Reliable responsive images: mobile WebP when available, root WebP on desktop, raster fallback.
 */
export default function InvitePicture({
  name,
  ext = 'png',
  alt = '',
  className = '',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  sizes,
}) {
  const fallback = `/${name}.${ext}`

  return (
    <picture>
      {MOBILE_WEBP.has(name) ? (
        <source media="(max-width: 767px)" srcSet={`/mobile/${name}.webp`} type="image/webp" />
      ) : null}
      {ROOT_WEBP.has(name) ? (
        <source srcSet={`/${name}.webp`} type="image/webp" />
      ) : null}
      <img
        src={fallback}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        sizes={sizes}
      />
    </picture>
  )
}
