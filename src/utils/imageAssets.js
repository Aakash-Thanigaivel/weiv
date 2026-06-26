export const MOBILE_MAX_WIDTH = 767

export const isMobileMedia = () =>
  typeof window !== 'undefined' &&
  window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches

export const isVercelImageCdnAvailable = () =>
  import.meta.env.PROD && typeof window !== 'undefined'

export const getVercelImageUrl = (path, { width, quality = 80 } = {}) => {
  if (!isVercelImageCdnAvailable() || !width) {
    return null
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const absoluteUrl = `${window.location.origin}${normalizedPath}`

  return `/_vercel/image?url=${encodeURIComponent(absoluteUrl)}&w=${width}&q=${quality}&fm=webp`
}

export const getInviteImageSources = ({
  name,
  ext = 'png',
  mobileWidth = 480,
  desktopWidth = 1024,
} = {}) => {
  const fallback = `/${name}.${ext}`
  const localMobileWebp = `/mobile/${name}.webp`
  const localDesktopWebp = `/${name}.webp`
  const vercelMobile = getVercelImageUrl(fallback, { width: mobileWidth, quality: 80 })
  const vercelDesktop = getVercelImageUrl(fallback, { width: desktopWidth, quality: 85 })

  return {
    fallback,
    mobile: vercelMobile ?? localMobileWebp,
    desktop: vercelDesktop ?? localDesktopWebp,
    useVercelCdn: Boolean(vercelMobile),
  }
}
