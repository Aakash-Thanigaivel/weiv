/**
 * Serves WebP on supported browsers with a smaller mobile variant.
 * Falls back to the original raster in public/.
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
  const desktopWebp = `/${name}.webp`
  const mobileWebp = `/mobile/${name}.webp`

  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobileWebp} type="image/webp" />
      <source srcSet={desktopWebp} type="image/webp" />
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
