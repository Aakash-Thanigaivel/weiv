import { getInviteImageSources } from '../utils/imageAssets'

/**
 * Responsive image with Vercel CDN (production), local WebP, and raster fallback.
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
  mobileWidth = 480,
  desktopWidth = 1024,
}) {
  const sources = getInviteImageSources({ name, ext, mobileWidth, desktopWidth })

  return (
    <picture>
      <source
        media="(max-width: 767px)"
        srcSet={sources.mobile}
        type="image/webp"
      />
      <source srcSet={sources.desktop} type="image/webp" />
      <img
        src={sources.fallback}
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
